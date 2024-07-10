import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { CreateEmprestimoDto } from './dto/create-emprestimo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Emprestimo } from './entities/emprestimo.entity';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';

@Injectable()
export class EmprestimoService {
  private readonly logger = new Logger(EmprestimoService.name);

  constructor(
    @InjectRepository(Emprestimo)
    private emprestimoRepository: Repository<Emprestimo>,
    @InjectRepository(Pessoa)
    private pessoaRepository: Repository<Pessoa>,
  ) {}

  async criarEmprestimo(
    createEmprestimoDto: CreateEmprestimoDto,
  ): Promise<Emprestimo> {
    this.logger.log(
      `Creating emprestimo: ${JSON.stringify(createEmprestimoDto)}`,
    );

    const { pessoaId, valor, numeroParcelas } = createEmprestimoDto;

    const pessoa = await this.pessoaRepository.findOne({
      where: { id: pessoaId },
    });

    if (!pessoa) {
      this.logger.warn(`Pessoa not found with id: ${pessoaId}`);
      throw new NotFoundException(`Pessoa with id ${pessoaId} not found`);
    }

    this.validateEmprestimo(pessoa, valor, numeroParcelas);

    const emprestimo = this.emprestimoRepository.create({
      ...createEmprestimoDto,
      pessoa,
    });

    try {
      const savedEmprestimo = await this.emprestimoRepository.save(emprestimo);
      this.logger.log(`Emprestimo created with id: ${savedEmprestimo.id}`);
      return savedEmprestimo;
    } catch (error) {
      this.logger.error(
        `Error creating emprestimo: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to create emprestimo');
    }
  }

  private validateEmprestimo(
    pessoa: Pessoa,
    valor: number,
    numeroParcelas: number,
  ): void {
    if (valor > pessoa.valorMaxEmprestimo) {
      throw new BadRequestException(
        `Valor do empréstimo (${valor}) maior que o permitido (${pessoa.valorMaxEmprestimo})`,
      );
    }

    const valorParcela = valor / numeroParcelas;
    if (valorParcela < pessoa.valorMinParcela) {
      throw new BadRequestException(
        `Valor da parcela (${valorParcela}) menor que o mínimo permitido (${pessoa.valorMinParcela})`,
      );
    }

    const MAX_PARCELAS = 24;
    if (numeroParcelas > MAX_PARCELAS) {
      throw new BadRequestException(
        `Número de parcelas (${numeroParcelas}) maior que o permitido (${MAX_PARCELAS})`,
      );
    }
  }

  async findAll(): Promise<Emprestimo[]> {
    this.logger.log('Fetching all emprestimos');
    try {
      return await this.emprestimoRepository.find({ relations: ['pessoa'] });
    } catch (error) {
      this.logger.error(
        `Error fetching emprestimos: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to fetch emprestimos');
    }
  }
}
