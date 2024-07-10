import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UseGuards,
  Logger,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { Pessoa } from './entities/pessoa.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('pessoas')
@Controller('pessoas')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PessoasController {
  private readonly logger = new Logger(PessoasController.name);

  constructor(private readonly pessoasService: PessoasService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pessoa' })
  @ApiResponse({
    status: 201,
    description: 'The pessoa has been successfully created.',
    type: Pessoa,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'Conflict. Person already exists.' })
  async create(@Body() createPessoaDto: CreatePessoaDto): Promise<Pessoa> {
    try {
      return await this.pessoasService.create(createPessoaDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating person');
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all pessoas' })
  @ApiResponse({
    status: 200,
    description: 'Return all pessoas.',
    type: [Pessoa],
  })
  async findAll(): Promise<Pessoa[]> {
    this.logger.log('Fetching all pessoas');
    return this.pessoasService.findAll();
  }
}
