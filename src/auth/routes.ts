import express, { Request, Response } from 'express'
import { PassportStatic } from 'passport'
import { register } from 'src/auth'
import * as tokens from 'src/auth/tokens'
import { models } from 'src/database'

const router = express.Router()

module.exports = function (passport: PassportStatic) {
  /**
   * Validate Token
   */
  router.post(
    '/validate-token',
    tokens.authMiddleware(),
    async (req: Request, res: Response) => {
      if (res.locals?.user_id) {
        const user = models.User.findByPk(res.locals.user_id)
        delete (user as any).password
        return res.send(user)
      }
      res.send({ message: '404: User Not Found' }).status(404)
    },
  )

  /**
   * Login
   */
  router.post(
    '/login',
    passport.authenticate('local'),
    function (req: Request, res: Response) {
      res.send(req.user)
    },
  )

  /**
   * Register
   */
  router.post('/register', async (req: Request, res: Response) => {
    try {
      await register({
        email: req.body.email,
        password: req.body.password,
      })
      res.send('OK')
    } catch (err: any) {
      res.send(err.message)
    }
  })

  return router
}
