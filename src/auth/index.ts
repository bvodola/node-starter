import bcrypt from 'bcryptjs'
import * as tokens from 'src/auth/tokens'
import { CreateUserDto } from 'src/types'
import { models } from 'src/database'

export function register(newUser: CreateUserDto) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!newUser.email || !newUser.password) {
        throw new Error('Invalid user email or password')
      }

      if (typeof newUser.password !== 'undefined') {
        newUser.password = bcrypt.hashSync(
          newUser.password,
          bcrypt.genSaltSync(8),
        )
      }

      const user: any = await models.User.create({
        ...newUser,
      })

      const token = await tokens.generate({ id: user.id })
      models.User.update(
        { token },
        {
          where: {
            id: user.id,
          },
        },
      )

      resolve('User created')
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}
