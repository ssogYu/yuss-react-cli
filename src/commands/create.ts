const handlebars = require("handlebars");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs-extra");
const download = require("download-git-repo");
const execa = require("execa");

const template_git_url =
  "https://github.com/ssogYu/webpack-react-template.git#master";
/**
 * 下载模板
 * @param path 下载路径
 * @returns
 */
const downloadTemplate = (path: string) => {
  return new Promise((resolve, reject) => {
    download(
      `direct:${template_git_url}`,
      path,
      { clone: true },
      (err: any) => {
        if (err) {
          reject(err);
          return;
        }
        inquirer
          .prompt([
            {
              type: "input",
              name: "name",
              message: "请输入项目名称",
              default: "projet name",
            },
            {
              type: "input",
              name: "description",
              message: "请输入项目简介",
              default: "description",
            },
            {
              type: "input",
              name: "author",
              message: "请输入作者姓名",
              default: "your name",
            },
          ])
          .then((answers: any) => {
            const packagePath = `${path}/package.json`;
            const packageContent = fs.readFileSync(packagePath, "utf-8");
            const packageResult = handlebars.compile(packageContent)(answers);
            fs.writeFileSync(packagePath, packageResult);
            execa.commandSync("npm install", {
              stdio: "inherit",
              cwd: path,
            });
            resolve("项目创建完成");
          });
      }
    );
  });
};
/**
 * 检测文件夹是否已经存在
 * @param targetDir
 * @returns
 */
export const checkProjectExist = async (targetDir: string) => {
  if (fs.existsSync(targetDir)) {
    const answer = await inquirer.prompt({
      type: "list",
      name: "checkExist",
      message: `项目路径 [${targetDir}] 已存在，请选择`,
      choices: ["覆盖", "取消"],
    });
    if (answer.checkExist === "覆盖") {
      fs.removeSync(targetDir);
    } else {
      return true;
    }
  }
  return false;
};

const action = async (name: string, context: any) => {
  try {
    const targetDir = path.join(context?.context ?? process.cwd(), name);
    const isExist = await checkProjectExist(targetDir);
    if (!isExist) {
      await downloadTemplate(targetDir);
    }
  } catch (error) {}
};
export default {
  command: "create <registry-name>",
  description: "创建项目",
  optionList: [["-c, --context <context>", "保存的路径"]],
  action,
};
