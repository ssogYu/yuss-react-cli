import { getPkgInfo } from "./lib/utils";
import commander from "commander";
const fg = require("fast-glob");
const { program } = commander;

/**
 * 获取路径
 * @param exac
 * @returns
 */
const getCommand = async (exac: string) => {
  const commandsPath = await fg(exac, { cwd: __dirname, deep: 1 });
  return commandsPath;
};

const start = async () => {
  const { packVersion, packName } = await getPkgInfo();
  program.version(packVersion, "-v,--version");
  const commandPathArr = (await getCommand("./commands/*.*s")) || [];
  commandPathArr.forEach((path: string) => {
    const commandModule = require(path);
    const { command, description, optionList, action } = commandModule.default;
    const curp = program
      .command(command)
      .description(description)
      .action(action);
    optionList &&
      optionList.map((option: [string]) => {
        curp.option(...option);
      });
  });

  program.on("command:*", async ([cmd]) => {
    program.outputHelp();
    process.exitCode = 1;
  });
  program.parseAsync(process.argv);
};
start();
