import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Emprestimo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pessoa)
  pessoa: Pessoa;

  @Column()
  valor: number;

  @Column()
  numeroParcelas: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao: Date;

  @Column({ default: 'PENDENTE' })
  statusPagamento: string;
}
