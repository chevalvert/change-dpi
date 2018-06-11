'use strict'

const fs = require('fs')
const path = require('path')
const express = require('express')
const forceSSL = require('express-force-ssl')
const http = require('http')
const https = require('https')
const cors = require('cors')
const upload = require('express-fileupload')
const resolveAbsolute = require(path.join(__dirname, 'utils', 'path-resolve-absolute'))

const defaultOpts = {
  httpPort: 80,
  httpsPort: 403,
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
  app.use(forceSSL)
  app.use(cors({ credentials: true, origin: true }))
  app.use(opts.endpoint, router)

  const api = {
    start: () => {
      const credentials = Object.entries(opts.credentials).reduce((c, [type, file]) => {
        c[type] = fs.readFileSync(resolveAbsolute(file))
        return c
      }, {})

      return Promise.all([
        new Promise(resolve => http.createServer(app).listen(opts.httpPort, () => resolve(opts.httpPort))),
        new Promise(resolve => https.createServer(credentials, app).listen(opts.httpsPort, () => resolve(opts.httpsPort)))
      ])
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
