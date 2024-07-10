import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { EmprestimoService } from './emprestimo.service';
import { CreateEmprestimoDto } from './dto/create-emprestimo.dto';
import { Emprestimo } from './entities/emprestimo.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('emprestimo')
@Controller('emprestimo')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class EmprestimoController {
  private readonly logger = new Logger(EmprestimoController.name);

  constructor(private readonly emprestimoService: EmprestimoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new emprestimo' })
  @ApiResponse({
    status: 201,
    description: 'The emprestimo has been successfully created.',
    type: Emprestimo,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Pessoa not found.' })
  async criarEmprestimo(
    @Body(new ValidationPipe({ transform: true }))
    createEmprestimoDto: CreateEmprestimoDto,
  ): Promise<Emprestimo> {
    this.logger.log(
      `Creating new emprestimo: ${JSON.stringify(createEmprestimoDto)}`,
    );
    return this.emprestimoService.criarEmprestimo(createEmprestimoDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all emprestimos' })
  @ApiResponse({
    status: 200,
    description: 'Return all emprestimos.',
    type: [Emprestimo],
  })
  async findAll(): Promise<Emprestimo[]> {
    this.logger.log('Fetching all emprestimos');
    return this.emprestimoService.findAll();
  }
}
