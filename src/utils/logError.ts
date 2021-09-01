/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import chalk from "chalk";

/**
 * Logs an error to the console.
 * @param error The error to log.
 */
export const logError = (error: any) : void => {
    console.error(`${chalk.red('[ERROR]')} ${chalk.redBright(error.toString())}`);
};