import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { IsInt, IsPositive, IsUrl, IsUUID } from "class-validator";
import { v4 } from "uuid";

export enum ProductType {
  TUMBLER = "tumbler",
  POSTER = "poster",
  TSHIRT = "tshirt",
}

@Entity("product")
export class Product {
  @PrimaryColumn("uuid")
  @IsUUID()
  id: string;

  @Column({
    type: "enum",
    enum: ProductType,
  })
  type: ProductType;

  @Column()
  @IsInt()
  @IsPositive()
  unitPrice: number;

  @Column({ nullable: true })
  @IsUrl()
  artworkURL?: string;

  constructor(product?: Partial<Product>) {
    this.id = product?.id ?? v4();
    if (product?.type) this.type = product.type;
    if (product?.unitPrice) this.unitPrice = product.unitPrice;
    if (product?.artworkURL) this.artworkURL = product.artworkURL;
  }

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
