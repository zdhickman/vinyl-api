import { Router } from 'express'
import { mysql as mysqlConfig } from '../config'
import { createConnection } from 'mysql2'
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

export default router
