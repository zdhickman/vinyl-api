import { Router } from 'express'
import { mysql as mysqlConfig, discogs } from '../config'
import { createConnection } from 'mysql2'
import request from 'request'

const router = new Router()

/**
 * @apiDefine master Master access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine admin Admin access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine user User access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine listParams
 * @apiParam {String} [q] Query to search.
 * @apiParam {Number{1..30}} [page=1] Page number.
 * @apiParam {Number{1..100}} [limit=30] Amount of returned items.
 * @apiParam {String[]} [sort=-createdAt] Order of returned items.
 * @apiParam {String[]} [fields] Fields to be returned.
 */

router.route('/covers')
  .get((_, res) => {
    const connection = createConnection(mysqlConfig)
    connection.connect()
    connection.query('SELECT * FROM covers', function (err, rows, fields) {
      if (err) throw err
      res.send(rows)
    })
    connection.end()
  })
  .put((_, __, next) => next(new Error('Not implemented')))
  .post((req, res) => {
    const connection = createConnection(mysqlConfig)
    connection.connect()
    const { releaseId, uri } = req.body
    connection.query(`INSERT INTO covers (release_id, uri) VALUES (?, ?)`, [releaseId, uri], (err, rows, fields) => {
      if (err) throw err
      res.send()
    })
    connection.end()
  })
  .delete((_, __, next) => next(new Error('Not implemented')))

router.route('/search')
  .get((req, res) => {
    const { q } = req.query
    const options = {
      url: `https://api.discogs.com/database/search?q=${q}&type=master&key=${discogs.key}&secret=${discogs.secret}`,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': discogs.userAgent
      }
    }

    request(options, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.error(error)
        throw new Error()
      }

      const results = JSON.parse(body)
      res.send(results)
    })
  })

export default router
