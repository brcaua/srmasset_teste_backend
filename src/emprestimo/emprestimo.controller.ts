import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmprestimoService } from './emprestimo.service';
import { CreateEmprestimoDto } from './dto/create-emprestimo.dto';

@Controller('emprestimo')
export class EmprestimoController {
  constructor(private readonly emprestimoService: EmprestimoService) {}

  @Post()
  criarEmprestimo(@Body() createEmprestimoDto: CreateEmprestimoDto) {
    return this.emprestimoService.criarEmprestimo(createEmprestimoDto);
  }

  @Get()
  findAll() {
    return this.emprestimoService.findAll();
  }
}
