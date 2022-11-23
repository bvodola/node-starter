import { User } from 'src/types'
import jwt from 'jsonwebtoken'
import { models } from 'src/database'
import { Request, Response, NextFunction } from 'express'

export function generate(data: any) {
  return new Promise((resolve, reject) => {
    jwt.sign(data, 'robocopisthesecret', {}, function (err, token) {
      if (err) reject(err)
      else {
        resolve(token)
      }
    })
  })
}

export function save(user: User, token: string) {
  return new Promise(async (resolve, reject) => {
    // Update user with token
    await models.User.update({ token }, { where: { id: user.id } })
    resolve({ ...user, token })
  })
}

export function validate(token: string): any {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.TOKEN_SECRET as jwt.Secret,
      function (err, data) {
        if (err) reject(err)
        else resolve(data)
      },
    )
  })
}

export const authMiddleware =
  (config: { bypass?: (req: Request) => boolean } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!config.bypass) config.bypass = () => false
      if (config.bypass(req) === true) return next()
      if (req.method == 'OPTIONS') return res.sendStatus(200)
      if (typeof req.headers.authorization === 'undefined')
        return res.sendStatus(401)

      const token = String(req.headers.authorization).split('Bearer ')[1]
      const tokenData = await validate(token)
      if (tokenData === 'undefined') res.sendStatus(401)

      res.locals.user_id = tokenData.id
      return next()
    } catch (err) {
      res.status(401).send({ message: '402: Invalid Token' })
    }
  }
