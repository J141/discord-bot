import { Message, MessageEmbed } from "discord.js";
import Command from "../abstracts/Command";
import CanIUseService from "../services/CanIUseService";
import { EMBED_COLOURS, EMOJIS } from "../config.json";

class CanIUseCommand extends Command {
	constructor() {
		super(
			"caniuse",
			"Shows browser support for features using the caniuse database.",
			{
				aliases: ["ciu"]
			},
		);
	}

	async run(message: Message, args: string[]): Promise<void> {
		const query = args.join(" ");
		const embed = new MessageEmbed();
		const canIUseService = CanIUseService.getInstance();
		const features = await canIUseService.getMatchingFeatures(query);

		if (features === null || features.getLength() === 0) {
			embed.setTitle("No matches found");
			embed.setDescription("Couldn't find any matches for your query in the caniuse database.");
			embed.setColor(EMBED_COLOURS.WARNING);
			await message.channel.send({ embed });
			return;
		}

		// If (features.getLength() === 1) {

		// }

		const pageCount = features.getPageCount();
		const titles = features.getPage(1).map(feature => feature.title).filter(title => title !== undefined) as string[];

		embed.setColor(EMBED_COLOURS.SUCCESS);
		embed.setTitle("Caniuse feature matches");

		let description = `Page 1 / ${pageCount} of matches found for query ${query}\n`;

		for (let i = 0; i < titles.length; i++) {
			description += `${i + 1}. ${titles[i]}\n`;
		}

		embed.setDescription(description);

		embed.setFooter(`Triggered by ${message.author}`);

		const newMessage = await message.channel.send({ embed });

		for (let i = 0; i < titles.length; i++) {
			// Eslint is incorrectly reporting unnecessary parentheses here.
			// eslint-disable-next-line no-extra-parens
			newMessage.react((EMOJIS as unknown as {[key: string]: string})[i + 1]);
		}
		if (pageCount > 1) newMessage.react(EMOJIS.NEXT_ARROW);
	}
}

export default CanIUseCommand;
