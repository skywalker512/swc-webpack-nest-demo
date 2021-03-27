import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './photo';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthorsResolver } from './authors.resolver';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   username: 'postgres',
    //   password: '',
    //   database: 'test',
    //   synchronize: true,
    //   autoLoadEntities: true,
    // }),
    // TypeOrmModule.forFeature([User]),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      playground: true,
    }),
    AuthorsResolver,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
