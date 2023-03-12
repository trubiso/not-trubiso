import Command from '@core/command';
import { pick } from '@core/utils';
import { author, e, noPermissionAnswers } from '@core/vars';
import { Client, Message, TextChannel } from 'discord.js';

async function allInAChannel(client: Client, channelId: string) {
  const channel = client.channels.cache.get(channelId)! as TextChannel;
  const messages: Message[] = [];

  // Create message pointer
  let message = await channel.messages
    .fetch({ limit: 1 })
    .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));

  let loaded = 0;
  while (message)
    await channel.messages.fetch({ limit: 100, before: message.id }).then(messagePage => {
      loaded += 100;
      console.log(`Loaded ${loaded}!`);
      messagePage.forEach(msg => messages.push(msg));

      // Update our message pointer to be last message in page of messages
      message = messagePage.size > 0 ? messagePage.at(messagePage.size - 1) : null;
    });

  return messages;
}

export = {
  name: 'scrape',
  help: {
    brief: `scraep all mesages and do som maffes ${e.nerd}`
  },
  async execute(channel?) {
    if (this.author.id !== author) {
      this.reply(pick(noPermissionAnswers));

      return;
    }
    if (!channel) throw `meybi nex tiem gib chanel to screp from yu dubmut !! ${e.please}`;
    await this.reply(`loading mesegis... ${e.thinky}`);
    const messages = await allInAChannel(this.client, channel);
    // author ID, author name, count
    const authorIds: string[] = [];
    const authorNames: { [id: string]: string } = {};
    const counts: { [id: string]: number } = {};
    let total = 0;
    for (const message of messages) {
      const currentAuthorId = message.author.id;
      if (!authorIds.includes(currentAuthorId)) {
        authorIds.push(currentAuthorId);
        authorNames[currentAuthorId] = message.author.username;
        counts[currentAuthorId] = 0;
      }
      counts[currentAuthorId]++;
      total++;
    }

    const ids = Object.keys(counts)
      .sort((a, b) => {
        return counts[b] - counts[a];
      })
      .slice(0, 20);

    let maxNameLength = 0;
    let maxCountLength = 0;
    let maxPercentageLength = 0;
    for (const id of ids) {
      const currentNameLength = authorNames[id].length;
      const currentCountLength = counts[id].toString().length;
      if (maxNameLength < currentNameLength) maxNameLength = currentNameLength;
      if (maxCountLength < currentCountLength) maxCountLength = currentCountLength;
      const percentage = ((counts[id] / total) * 100).toFixed(2);
      if (maxPercentageLength < percentage.length) maxPercentageLength = percentage.length;
    }

    let out = '```';
    for (const id of ids) {
      const currentName = authorNames[id];
      const currentCount = counts[id];
      const namePadding = ' '.repeat(maxNameLength - currentName.length);
      const countPadding = ' '.repeat(maxCountLength - currentCount.toString().length);
      out += `${namePadding}${currentName} -> ${counts[id]}${countPadding} `;

      const percentage = ((counts[id] / total) * 100).toFixed(2);
      const percentagePadding = ' '.repeat(maxPercentageLength - percentage.length);
      out += `(out of ${total} -> ${percentagePadding}${percentage}%)\n`;
    }
    out += '```';

    this.reply(`${out}`);
  }
} as Command;
