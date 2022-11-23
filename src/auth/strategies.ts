import bcrypt from 'bcryptjs'
import { PassportStatic } from 'passport'
import { models } from 'src/database'

var LocalStrategy = require('passport-local').Strategy

// ====
// Auth
// ====

module.exports = function (passport: PassportStatic) {
  passport.serializeUser(function (user, done) {
    done(null, (user as any).id)
  })

  passport.deserializeUser(async function (id: number, done) {
    try {
      const user = models.User.findByPk(id)
      done(null, user)
    } catch (err) {
      done(err)
    }
  })

  // =====
  // Local
  // =====
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
      },
      async function (email: string, password: string, done: any) {
        try {
          const user = await models.User.findOne({ where: { email } })
          if (!user)
            return done(null, false, { message: 'Incorrect username.' })

          const isPasswordCorrect = bcrypt.compareSync(password, user?.password)
          if (!isPasswordCorrect)
            return done(null, false, { message: 'Incorrect password.' })

          delete (user as any).password
          return done(null, user)
        } catch (err) {
          return done(err)
        }
      },
    ),
  )
}
