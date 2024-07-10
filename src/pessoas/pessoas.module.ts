import { Module } from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { PessoasController } from './pessoas.controller';
import { PessoaRepository } from './pessoas.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pessoa, PessoaRepository])],
  controllers: [PessoasController],
  providers: [PessoasService],
})
export class PessoasModule {}
