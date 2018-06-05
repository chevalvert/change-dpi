'use strict'

const path = require('path')
const express = require('express')
const cors = require('cors')
const upload = require('express-fileupload')
const findFirstAvailableAddress = require(path.join(__dirname, 'utils', 'find-first-available-address'))

const defaultOpts = {
  port: 8888,
  endpoint: '/api'
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
        server = app.listen(opts.port, () => {
          address = findFirstAvailableAddress() || '127.0.0.1'
          resolve(`http://${address}:${opts.port}`)
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
