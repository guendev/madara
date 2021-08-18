const fs = require('fs')
module.exports.removeFile = (path) => {
  try {
    fs.unlinkSync(path)
  } catch (e) {}
}
