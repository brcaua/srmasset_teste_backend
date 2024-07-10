import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmprestimoDto } from './dto/create-emprestimo.dto';
import { UpdateEmprestimoDto } from './dto/update-emprestimo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Emprestimo } from './entities/emprestimo.entity';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';

@Injectable()
export class EmprestimoService {
  constructor(
    @InjectRepository(Emprestimo)
    private emprestimoRepository: Repository<Emprestimo>,
    @InjectRepository(Pessoa)
    private pessoaRepository: Repository<Pessoa>,
  ) {}

  async criarEmprestimo(
    createEmprestimoDto: CreateEmprestimoDto,
  ): Promise<Emprestimo> {
    const pessoa = await this.pessoaRepository.findOne({
      where: { id: createEmprestimoDto.pessoaId },
    });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    if (createEmprestimoDto.valor > pessoa.valorMaxEmprestimo) {
      throw new BadRequestException(
        'Valor do empréstimo maior que o permitido',
      );
    }

    if (createEmprestimoDto.numeroParcelas > pessoa.valorMaxEmprestimo) {
      throw new BadRequestException('Número de parcelas maior que o permitido');
    }

    const emprestimo = this.emprestimoRepository.create(createEmprestimoDto);

    emprestimo.pessoa = pessoa;

    return this.emprestimoRepository.save(emprestimo);
  }

  async findAll(): Promise<Emprestimo[]> {
    return this.emprestimoRepository.find();
  }
}
