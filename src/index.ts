import Bot from '@core/bot';
import { discordToken } from '@core/vars';

const [,, ...args] = process.argv;
const isDev = args.includes('--dev');

const bot = new Bot('<', isDev);
bot.start(discordToken);
