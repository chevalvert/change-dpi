const path = require('path')
const rootPath = path.join(__dirname, '..', '..')
module.exports = p => path.join(path.isAbsolute(p) ? '' : rootPath, p)
