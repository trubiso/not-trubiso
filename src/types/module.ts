import { Command } from "./command";

/**
 * The Module type defines guidelines for category objects.
 */
export type Module = {
    /**
     * The module's name, should match with the filename and the respective folder in the commands folder.
     */
    name: string,
    /**
     * Help about the category.
     */
    help: {
        /**
         * Another name for the category, usually a longer version of Module.name
         */
        name: string,
        /**
         * A brief description for the category.
         */
		brief: string
	},
    /**
     * An array of the commands for the category.
     */
    commands: Command[]
}