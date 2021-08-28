const answers = require('../vars.js').permission_denied_answers;

module.exports = {
    permissionError(message) {
        let answer_pos = Math.floor(Math.random()*answers.length);
        let answer = answers[answer_pos];
        message.reply(answer);
    }
}