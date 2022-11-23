import { Table, Model, Column } from 'sequelize-typescript'

/**
 * User
 */
@Table
export class User extends Model {
  @Column
  declare email: string

  @Column
  declare password: string

  @Column
  declare token: string
}
