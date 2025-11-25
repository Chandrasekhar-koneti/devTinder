const multer = require("multer");

const storage = multer.memoryStorage(); //storing file in memory
const upload = multer({ storage });

module.exports = upload;
