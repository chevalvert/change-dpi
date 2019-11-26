#!/usr/bin/env node
'use strict'

const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '.env') })
process.env.NODE_ENV = process.env.NODE_ENV || 'production'
process.title = 'change-dpi'

const { version } = require(path.join(__dirname, 'package.json'))

const pify = require('pify')
const tmp = require('tmp')
const dpi = require(path.join(__dirname, 'lib', 'dpi'))
const Server = require(path.join(__dirname, 'lib', 'server'))

Server({
  endpoint: '/api',
  httpPort: process.env.HTTP_PORT || 8080
})
  .route('/ping', (_, res) => res.status(200).json({ version }), 'GET')
  .route('/dpi/:dpi/:format?', changeDPI, 'POST')
  .start()
  .then(port => console.log(`Server is up and running on PORT ${port}`))
  .catch(err => console.error(err instanceof Error ? err : Error(err)))

function changeDPI (req, res) {
  if (!req.files || !Object.values(req.files)[0]) {
    return res.status(400).json({ error: 'No files were uploaded.' })
  }

  const file = Object.values(req.files)[0]
  const format = req.params.format
  const input = tmp.tmpNameSync()

  Promise.resolve()
    .then(() => pify(file.mv)(input))
    .then(() => dpi({
      input,
      format,
      output: tmp.tmpNameSync({ postfix: '.' + format }),
      dpi: req.params.dpi
    }))
    .then(output => {
      const filename = format
        ? (file.name.substr(0, file.name.lastIndexOf('.')) || file.name) + '.' + format
        : file.name

      if (process.env.VERBOSE === 'true') {
        console.log(filename, `(${format}, ${req.params.dpi}dpi)`, output)
      }

      res.status(201).download(output, filename)
    })
    .catch(error => {
      error = error instanceof Error ? error : Error(error)
      tmp.setGracefulCleanup()
      res.status(500).json({ error: error.message })
      console.error(error)
    })
}
