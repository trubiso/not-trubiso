const { e } = require('../../vars.json');

module.exports = {
	name: '8ball',
	help: {
        category: 'fun',
		brief: 'da smili gods will decied if they can agree with somthing!',
		usage: '8ball <question>'
	},
    execute(message, args, client) {
        if (!args.length) {
            message.channel.send(`yu hab to ask a questione! ${e.really.e}`);
        }
        else {
            const answers = [`absolutlie, of cuors!! ${e.happy.e}`, `noe.. not at alle.. ${e.sad.e}`,
            `honestlie... ${e.angel.e} i hav no ideae ${e.sad.e}`,
            `dat's obviouslie a noe ${e.sad.e}`,
            `i thinke soe.. ${e.think.e}`,
            `i dont think soe ${e.sad.e}`, `obviouslie ${e.glad.e}`,
            `i'm not suar ${e.think.e}`,
            `hard to answere ${e.sad2.e}`,
            `i'm 100% certaine, yese!! ${e.excited.e}`,
            `how am i supoesd to giv an anser to dat ${e.think.e}`,
            `maybi!! ${e.glad.e}`, `wat da hekke? NOE!! ${e.angry_pink.e}`,
            `dis question doesnt maek sens ${e.think.e}`,
            `maybi ${e.think.e}`, `noe.. ${e.sad.e}`,
            `i dont wana tel yu ${e.silly.e}`,
            `of cuors!! ${e.happy.e}`, `yeahe ${e.glad.e}`,
            `i dubt it ${e.sad.e}`,
            `da rng says yese! ${e.glad.e}`];

            let answer_pos = Math.floor(Math.random()*answers.length);
            let answer = answers[answer_pos];

            message.reply(answer);
        }
    },
};