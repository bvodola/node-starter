import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import passport from 'passport'
import bodyParser from 'body-parser'
import session from 'cookie-session'
import crud from './crud'
import { authMiddleware } from './auth/tokens'

const app = express()
const port = process.env.PORT || 3003
const userRoutes = crud('User')

// ====
// CORS
// ====
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})

// ==========
// Middleware
// ==========
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/static', express.static('static/'))
app.use(session({ secret: process.env.PASSPORT_SECRET }))
app.use(passport.initialize())

// ====
// Auth
// ====
require('./auth/strategies')(passport)
app.use('/auth', require('./auth/routes')(passport))

// ==========
// API Routes
// ==========
app.use('/users', authMiddleware(), userRoutes)

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`)
})
