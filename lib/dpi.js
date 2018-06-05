'use strict'

const im = require('imagemagick')

module.exports = ({ input, output, dpi = 72, format } = {}) => new Promise((resolve, reject) => {
  const cmd = `-units PixelsPerInch ${input} -density ${dpi} ${format ? (format + ':' + output) : output}`
  im.convert(cmd.split(' '), err => {
    if (err) reject(err)
    else resolve(output)
  })
})
