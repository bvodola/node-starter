import {
  Table,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript'

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

  @HasMany(() => Refund)
  declare refunds: Refund[]
}

/**
 * Address
 */
@Table
export class Address extends Model {
  @Column
  declare name: string

  @Column
  declare street: string

  @Column
  declare neighborhood: string

  @Column
  declare city: string

  @Column
  declare state: string

  @Column
  declare zip: string

  @ForeignKey(() => Client)
  @Column
  declare clientId: number

  @ForeignKey(() => Partner)
  @Column
  declare partnerId: number

  @ForeignKey(() => Lab)
  @Column
  declare labID: number
}

/**
 * Insurance
 */
@Table
export class Insurance extends Model {
  @Column
  declare name: string

  @HasMany(() => Client)
  declare clients: Client[]

  @HasMany(() => Refund)
  declare refunds: Refund[]
}

/**
 * Lab
 */
@Table
export class Lab extends Model {
  @Column
  declare name: string

  @HasMany(() => Client)
  declare clients: Client[]

  @BelongsToMany(() => Partner, () => LabPartner)
  declare partners: Partner[]
}

/**
 * Client
 */
@Table
export class Client extends Model {
  @Column
  declare name: string

  @Column
  declare cpf: number

  @ForeignKey(() => Insurance)
  @Column
  declare insuranceId: number

  @BelongsTo(() => Insurance)
  declare insurance: Insurance

  @ForeignKey(() => Lab)
  @Column
  declare labId: number

  @BelongsTo(() => Lab)
  declare lab: Lab

  @HasMany(() => Contact)
  declare contacts: Contact[]

  @HasMany(() => Refund)
  declare refunds: Refund[]
}

/**
 * Refund
 */
@Table
export class Refund extends Model {
  @Column
  declare examDate: Date

  @Column
  declare requestDate: Date

  @Column
  declare paymentDate: Date

  @Column
  declare fiscalNumber: string

  @Column
  declare amountRequested: number

  @Column
  declare status: string

  @Column
  declare isPartnerPaid: boolean

  @ForeignKey(() => Client)
  @Column
  declare clientId: number

  @BelongsTo(() => Client)
  declare client: Client

  @ForeignKey(() => User)
  @Column
  declare userId: number

  @BelongsTo(() => User)
  declare user: User

  @ForeignKey(() => Insurance)
  @Column
  declare insuranceId: number

  @BelongsTo(() => Insurance)
  declare insurance: Insurance
}

/**
 * Partner
 */
@Table
export class Partner extends Model {
  @Column
  declare name: string

  @Column
  declare type: string

  @HasMany(() => Contact)
  declare contacts: Contact[]

  @BelongsToMany(() => Lab, () => LabPartner)
  declare labs: Lab[]
}

/**
 * LabPartner
 */
@Table
export class LabPartner extends Model {
  @ForeignKey(() => Lab)
  @Column
  declare labId: number

  @ForeignKey(() => Partner)
  @Column
  declare partnerId: number
}

/**
 * Contact
 */
@Table
export class Contact extends Model {
  @Column
  declare type: string

  @Column
  declare value: string

  @Column
  declare token: string

  @ForeignKey(() => Client)
  @Column
  declare clientId: number

  @BelongsTo(() => Client)
  declare client: Client

  @ForeignKey(() => Partner)
  @Column
  declare partnerId: number

  @BelongsTo(() => Partner)
  declare partner: Partner
}
