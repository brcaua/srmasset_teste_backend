import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmprestimoModule } from './emprestimo/emprestimo.module';
import { PessoasModule } from './pessoas/pessoas.module';
import { PagamentoModule } from './pagamento/pagamento.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345678',
      database: 'loan_app',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    PessoasModule,
    EmprestimoModule,
    PagamentoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
