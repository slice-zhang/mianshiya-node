const multer = require("multer");
const path = require("path");
const fs = require("fs");
const tempDir = path.join(__dirname, "../temp");

// 确保临时目录存在
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

/**
 * 支持的文件类型
 */
const supportFileMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

/**
 * 最大文件大小限制
 */
const supportMaxFileSize = 100 * 1024 * 1024;

// 创建 multer 实例，自动处理文件，并挂在到req上
const multerMiddleware = multer({
  dest: "uploads/temp/",
  limits: { fileSize: supportMaxFileSize },
  fileFilter: (req, file, cb) => {
    const fileMimeType = file.mimetype.toLowerCase();
    if (!supportFileMimeTypes.includes(fileMimeType)) {
      cb(new Error("不支持的文件类型"), false);
      return;
    }
    cb(null, true);
  },
});

module.exports = multerMiddleware;
