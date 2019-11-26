'use strict'

const express = require('express')
const http = require('http')
const cors = require('cors')
const upload = require('express-fileupload')

const defaultOpts = {
  httpPort: 8080,
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

  const api = {
    start: () => {
      return new Promise(resolve => {
        http
          .createServer(app)
          .listen(opts.httpPort, () => resolve(opts.httpPort))
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
