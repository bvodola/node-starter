import { Sequelize } from 'sequelize-typescript'
import * as models from './models'

const DATABASE_URL = process.env.DATABASE_URL ?? ''
const sequelize = new Sequelize(DATABASE_URL)

;(async () => {
  try {
    await sequelize.authenticate()
    console.log('-- Connection has been established successfully. --')

    sequelize.addModels([
      models.Address,
      models.Client,
      models.Contact,
      models.Insurance,
      models.Lab,
      models.Partner,
      models.Refund,
      models.User,
      models.LabPartner,
    ])

    await sequelize.sync({ force: false })
    console.log('-- Database synced --')
  } catch (err) {
    console.error('Unable to connect to the database:', err)
  }
})()

export default sequelize
export { models }
