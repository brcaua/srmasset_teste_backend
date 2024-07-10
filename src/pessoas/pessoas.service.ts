import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { Pessoa } from './entities/pessoa.entity';
import { PessoaRepository } from './pessoas.repository';
import { validate } from 'class-validator';

type TipoIdentificador = 'PF' | 'PJ' | 'EU' | 'AP';

interface Valores {
  valorMinParcela: number;
  valorMaxEmprestimo: number;
}

@Injectable()
export class PessoasService {
  private readonly tipoIdentificadorMap: Record<number, TipoIdentificador> = {
    11: 'PF',
    14: 'PJ',
    13: 'EU',
    12: 'AP',
  };

  private readonly valoresMap: Record<TipoIdentificador, Valores> = {
    PF: { valorMinParcela: 300, valorMaxEmprestimo: 10000 },
    PJ: { valorMinParcela: 1000, valorMaxEmprestimo: 100000 },
    EU: { valorMinParcela: 100, valorMaxEmprestimo: 10000 },
    AP: { valorMinParcela: 400, valorMaxEmprestimo: 25000 },
  };

  constructor(
    @InjectRepository(Pessoa)
    private pessoaRepository: Repository<Pessoa>,
  ) {}

  async create(createPessoaDto: CreatePessoaDto): Promise<Pessoa> {
    await this.validateCreateDto(createPessoaDto);

    const existingPessoa = await this.pessoaRepository.findOne({
      where: { identificador: createPessoaDto.identificador },
    });

    if (existingPessoa) {
      throw new ConflictException(
        'Uma pessoa com este identificador já existe',
      );
    }

    const tipoIdentificador = this.setTipoIdentificador(
      createPessoaDto.identificador,
    );
    const valores = this.setValores(tipoIdentificador);

    const pessoa = this.createPessoaEntity(
      createPessoaDto,
      tipoIdentificador,
      valores,
    );

    try {
      return await this.pessoaRepository.save(pessoa);
    } catch (error) {
      throw new BadRequestException('Erro ao salvar pessoa no banco de dados');
    }
  }

  async findAll(): Promise<Pessoa[]> {
    try {
      return await this.pessoaRepository.find();
    } catch (error) {
      throw new BadRequestException('Erro ao buscar pessoas');
    }
  }

  async findOne(id: number): Promise<Pessoa> {
    try {
      const pessoa = await (
        this.pessoaRepository as PessoaRepository
      ).findOnePessoa(id);
      if (!pessoa) {
        throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
      }
      return pessoa;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar pessoa');
    }
  }

  private async validateCreateDto(
    createPessoaDto: CreatePessoaDto,
  ): Promise<void> {
    const errors = await validate(createPessoaDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
  }

  private createPessoaEntity(
    createPessoaDto: CreatePessoaDto,
    tipoIdentificador: TipoIdentificador,
    valores: Valores,
  ): Pessoa {
    return Object.assign(new Pessoa(), createPessoaDto, {
      tipoIdentificador,
      valorMinParcela: valores.valorMinParcela,
      valorMaxEmprestimo: valores.valorMaxEmprestimo,
    });
  }

  private setTipoIdentificador(identificador: string): TipoIdentificador {
    const tipoIdentificador = this.tipoIdentificadorMap[identificador.length];
    if (!tipoIdentificador) {
      throw new BadRequestException('Identificador inválido');
    }
    return tipoIdentificador;
  }

  private setValores(tipoIdentificador: TipoIdentificador): Valores {
    const valores = this.valoresMap[tipoIdentificador];
    if (!valores) {
      throw new BadRequestException('TipoIdentificador inválido');
    }
    return valores;
  }
}
