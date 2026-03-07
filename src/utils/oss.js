const path = require("path");
const sharp = require("sharp");
/**
 * 压缩图片
 * @param {string} sourcePath
 * @returns {Promise<string>}
 */
async function compressImage(sourcePath) {
  const ext = path.extname(sourcePath);
  const baseName = path.basename(sourcePath, ext);
  const dirName = path.dirname(sourcePath);
  const targetPath = path.join(dirName, `${baseName}_compressed${ext}`);
  await sharp(sourcePath)
    .jpeg({ quality: 70, mozjpeg: true })
    .png({ quality: 70, compressionLevel: 6 })
    .toFile(targetPath);
  return targetPath;
}

module.exports = {
  compressImage,
};
