# Not Trubiso
world'se frist smili bot !!
(fun multipurpose discord bot that has been rewritten in typescript)
## Setup
 - clone the repository (`git clone` or download it as a zip & extract)
 - install the dependencies with `npm i` (install `npm` if you don't have it)
 - set up the token file / env variable, either by:
	 - making a file named `config.json`: `{ "token": "insert token here" }`
	 - setting an environmental variable called `NT_TOKEN` to your token
 - run the bot, either by:
	 - `npm run run` (works on systems that use bash)
	 - `tsc` to compile, copy the `vars.json` file into the `out` folder (also the `config.json` file if you created it) and then go to the `out` folder and run `node .`
 - in the terminal you should see `Logged in as <username and discriminator>!`.
 - if you encounter any errors during this process, feel free to open an issue and/or a pull request
## How to make a command
 - if you are trying to make a command in a category that doesn't exist, you should make a new category file in the `categories` folder which will define your category and will also make sure that your command loads.
	 - make sure to set up the metadata as dictated by the `Module` type
 - make a new file in the `commands/<category name>` folder named after your command's name
 - set up the metadata as dictated by the `Command` type
 - write your code in the `execute` method
