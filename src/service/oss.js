const fs = require("fs");
const config = require("@/config/config-default");
const { compressImage } = require("@/utils/oss");

const saveFileToOss = async (app, req) => {
  if (req.fileValidationError) {
    throw new Error(req.fileValidationError.message);
  }
  if (!req.file) {
    throw new Error("请上传文件");
  }
  const filePath = req.file.path;
  let compressPath = "";
  try {
    compressPath = await compressImage(filePath);
    const mimeType = req.file.mimetype;
    const savePath = `/${config.oss.path}/${mimeType}/${new Date()
      .toLocaleDateString()
      .replace(/\//g, "-")}/${req.file.originalname}`;
    const result = await app.ossClient.put(savePath, compressPath);
    return result.url;
  } catch (err) {
    throw new Error(err.message);
  } finally {
    filePath && fs.unlinkSync(filePath);
    fs.unlinkSync(compressPath);
  }
};

module.exports = {
  saveFileToOss,
};
