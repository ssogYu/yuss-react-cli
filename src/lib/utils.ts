const path = require("path");
const fs = require("fs");
/**
 * 获取包信息
 * @returns
 */
export const getPkgInfo = (): Promise<{
  packVersion: string;
  packName: string;
}> => {
  return new Promise((resolve, _) => {
    const jsonPath = path.join(__dirname, "../../package.json");
    const jsonContent = fs.readFileSync(jsonPath, "utf-8");
    const jsonResult = JSON.parse(jsonContent);
    const packVersion = jsonResult.version;
    const packName = jsonResult.name;
    resolve({ packVersion, packName });
  });
};
