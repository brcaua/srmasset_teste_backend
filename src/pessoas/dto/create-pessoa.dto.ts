import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePessoaDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  identificador: string;

  @IsNotEmpty()
  @IsDate()
  dataNascimento: Date;

  @IsNumber()
  valorMinParcela: number;

  @IsNumber()
  valorMaxEmprestimo: number;
}
