import { Command } from "../../types/command";
const { e } = require('../../vars.json');
const converter = require("convert-units");

export = {
	name: 'convert',
	help: {
		category: 'utils',
		brief: 'convertse unitse',
		usage: 'convert <number> <source unit> <destination unit>',
		extra: (()=>{
			let out = `${e.nerd.e} **posibol unitse**`;
			for(const measure of converter().measures()){
				out += `\n\t**${measure}**: `;
				for(const possibility of converter().possibilities(measure)){
					out += `${possibility}, `;
				}
				out = out.slice(0, -2);
			}
			return out;
		})()
	},
	execute(message, args) {
		let out = "";
		if (!args.length || args.length != 3)
			throw `yu shuld chek de usag on dis comand ${e.think.e} yu hav given me de rong number of prameterse ${e.sad.e}`;
		const num = parseFloat(args[0]), src = args[1].toString(), dst = args[2].toString();
		try {
			const convertedVal : number = converter(num).from(src).to(dst);
			out = `${num} ${src} = ${convertedVal.toFixed(3)} ${dst}`;
		} catch (error) {
			throw `yur units dont mak sens !! ${e.silly.e} yu probabli put em in de wrong ordere... jus do **<help convert**...`;
		}
		return message.reply(out);
	}
} as Command;