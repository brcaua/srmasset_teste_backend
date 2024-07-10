import { EntityRepository, Repository } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity';

@EntityRepository(Pessoa)
export class PessoaRepository extends Repository<Pessoa> {
  async savePessoa(pessoa: Pessoa): Promise<Pessoa> {
    return await this.save(pessoa);
  }

  async findAll(): Promise<Pessoa[]> {
    return await this.find();
  }

  async findOnePessoa(id: number): Promise<Pessoa> {
    return await this.findOne({ where: { id } });
  }
}
