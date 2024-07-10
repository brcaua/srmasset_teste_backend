import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { Pessoa } from './entities/pessoa.entity';
import { PessoaRepository } from './pessoas.repository';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private pessoaRepository: Repository<Pessoa>,
  ) {}

  async create(createPessoaDto: CreatePessoaDto): Promise<Pessoa> {
    if (
      !createPessoaDto.identificador ||
      !createPessoaDto.nome ||
      !createPessoaDto.dataNascimento
    ) {
      throw new Error('Dados inválidos');
    }

    const tipoIdentificador = this.setTipoIdentificador(
      createPessoaDto.identificador,
    );
    const valores = this.setValores(tipoIdentificador);

    const pessoa = new Pessoa();

    pessoa.nome = createPessoaDto.nome;
    pessoa.identificador = createPessoaDto.identificador;
    pessoa.dataNascimento = createPessoaDto.dataNascimento;
    pessoa.tipoIdentificador = tipoIdentificador;
    pessoa.valorMinParcela = valores.valorMinParcela;
    pessoa.valorMaxEmprestimo = valores.valorMaxEmprestimo;

    return await this.pessoaRepository.save(pessoa);
  }

  async findAll(): Promise<Pessoa[]> {
    return await this.pessoaRepository.find();
  }

  async findOne(id: number): Promise<Pessoa> {
    return await (this.pessoaRepository as PessoaRepository).findOnePessoa(id);
  }

  private readonly tipoIdentificadorMap = {
    11: 'PF',
    14: 'PJ',
    13: 'EU',
    12: 'AP',
  };

  private readonly valoresMap = {
    PF: { valorMinParcela: 300, valorMaxEmprestimo: 10000 },
    PJ: { valorMinParcela: 1000, valorMaxEmprestimo: 100000 },
    EU: { valorMinParcela: 100, valorMaxEmprestimo: 10000 },
    AP: { valorMinParcela: 400, valorMaxEmprestimo: 25000 },
  };

  private setValores(tipoIdentificador: string) {
    const valores = this.valoresMap[tipoIdentificador];
    if (!valores) {
      throw new Error('TipoIdentificador inválido');
    }
    return valores;
  }

  private setTipoIdentificador(identificador: string): string {
    const tipoIdentificador = this.tipoIdentificadorMap[identificador.length];
    if (!tipoIdentificador) {
      throw new Error('Identificador inválido');
    }
    return tipoIdentificador;
  }
}
