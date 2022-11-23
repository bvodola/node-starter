import express, { Router } from 'express'
import { models } from './database'

export default function crudGenerator(collectionName: 'User', router?: Router) {
  // ======
  // Config
  // ======
  if (!router) router = express.Router()
  const Model: any = models[collectionName]

  // ======
  // Create
  // ======
  router.post('/', async (req, res) => {
    try {
      const newEntry = req.body
      const newEntryRes = await Model.create(newEntry)
      res.send(newEntryRes).status(200)
    } catch (err) {
      console.log('CRUD create ERROR', err)
      res.status(500).send(err)
    }
  })

  // =======
  // Get One
  // =======
  router.get('/:id', async (req, res) => {
    try {
      const entry = await Model.findByPk(req.params.id)
      if (!entry) return res.status(404).send({ message: 'User Not Found' })
      res.send(entry)
    } catch (err) {
      console.log('CRUD findByPk ERROR', err)
      res.status(500).send(err)
    }
  })

  // ========
  // Get Many
  // ========
  router.get('/*', async (req, res) => {
    try {
      const entries = await Model.findAll()
      res.send(entries)
    } catch (err) {
      console.log('CRUD findAll ERROR', err)
      res.status(500).send(err)
    }
  })

  // ======
  // Update
  // ======
  router.put('/:id', async (req, res) => {
    try {
      const updatedEntry = req.body
      const updatedEntryRes = await Model.update(updatedEntry, {
        where: {
          id: req.params.id,
        },
      })

      res.send(updatedEntryRes).status(200)
    } catch (err) {
      console.log('CRUD update ERROR', err)
      res.status(500).send(err)
    }
  })

  // ======
  // Delete
  // ======
  router.delete('/:id', async (req, res) => {
    try {
      await Model.destroy({
        where: {
          id: req.params.id,
        },
      })
      res.sendStatus(204)
    } catch (err) {
      console.log('CRUD delete ERROR', err)
      res.status(500).send(err)
    }
  })

  return router
}
