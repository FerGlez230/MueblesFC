import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
    nullable: false,
  })
  email: string;

  @Column('text', {
    default: 'user',
  })
  role: string;

  @Column('text', {
    unique: true,
    nullable: false,
  })
  username: string;

  @Column('text')
  password: string;
}
