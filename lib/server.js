'use strict'

const path = require('path')
const express = require('express')
const https = require('https')
const cors = require('cors')
const upload = require('express-fileupload')
const findFirstAvailableAddress = require(path.join(__dirname, 'utils', 'find-first-available-address'))

const defaultOpts = {
  port: 8888,
  endpoint: '/api',
  credentials: {
    key: undefined,
    ca: undefined,
    cert: undefined
  }
}

module.exports = function (opts = {}) {
  opts = Object.assign({}, defaultOpts, opts)

  const app = express()
  const router = express.Router()

  app.use(upload())
  app.use(cors({ credentials: true, origin: true }))
  app.use(opts.endpoint, router)

  let server
  let address

  const api = {
    get server () { return server },
    get address () { return address },

    start: () => {
      return new Promise(resolve => {
        server = https.createServer(opts.credentials, app).listen(opts.port, () => {
          address = findFirstAvailableAddress() || '127.0.0.1'
          resolve(`https://${address}:${opts.port}`)
        })
      })
    },

    route: (endpoint, cb, method = 'GET') => {
      if (method === 'GET') router.get(endpoint, cb)
      if (method === 'POST') router.post(endpoint, cb)
      else router.all(endpoint, cb)
      return api
    }
  }

  return api
}
