import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { IsEmail, IsInt, IsPositive, IsUUID } from "class-validator";
import { v4 } from "uuid";

@Entity("payment")
export class Payment {
  @PrimaryColumn("uuid")
  @IsUUID()
  id: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsInt()
  @IsPositive()
  amount: number;

  constructor(payment?: Partial<Payment>) {
    this.id = payment?.id ?? v4();
    if (payment?.email) this.email = payment.email;
    if (payment?.amount) this.amount = payment.amount;
  }

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
