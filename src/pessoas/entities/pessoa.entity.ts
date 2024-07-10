import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pessoa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  identificador: string;

  @Column()
  dataNascimento: Date;

  @Column()
  tipoIdentificador: string;

  @Column({ default: 100 })
  valorMinParcela: number;

  @Column({ default: 1000 })
  valorMaxEmprestimo: number;
}
