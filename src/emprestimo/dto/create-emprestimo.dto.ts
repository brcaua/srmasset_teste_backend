import { IsNotEmpty, IsNumber, IsInt, Min, Max } from 'class-validator';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';

export class CreateEmprestimoDto {
  @IsNotEmpty({ message: 'O valor do empréstimo é obrigatório.' })
  @IsNumber({}, { message: 'O valor do empréstimo deve ser um número válido.' })
  @Min(500, { message: 'O valor mínimo do empréstimo deve ser de R$500.' })
  valor: number;

  @IsNotEmpty({ message: 'O número de parcelas é obrigatório.' })
  @IsInt({ message: 'O número de parcelas deve ser um número inteiro.' })
  @Min(1, { message: 'O mínimo de parcelas é 1.' })
  @Max(48, { message: 'O máximo de parcelas é 48.' })
  numeroParcelas: number;

  //pessoaId is the ID of the person who is taking the loan. use Pessoa entity to get the person's data
  @IsNotEmpty({ message: 'O ID da pessoa é obrigatório.' })
  pessoaId: number;
}
