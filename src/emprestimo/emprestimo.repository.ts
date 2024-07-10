import { EntityRepository, Repository } from 'typeorm';
import { Emprestimo } from './entities/emprestimo.entity';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';

@EntityRepository(Emprestimo)
export class EmprestimoRepository extends Repository<Emprestimo> {
  async criarEmprestimo(emprestimo: Emprestimo): Promise<Emprestimo> {
    return await this.save(emprestimo);
  }

  async findAll(): Promise<Emprestimo[]> {
    return await this.find();
  }
}
