import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { AdminModule } from './admin/admin.module';
import { OrderModule } from './order/order.module';
import { PaymentsModule } from './payments/payments.module';
import { FilesModule } from './files/files.module';
import { JobsModule } from './jobs/jobs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports:[ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [ join(process.cwd(), 'dist/**/*.entity.js')],
        synchronize: true // Don't have to use on the production
      })
    }),
    AuthModule, 
    UserModule, 
    ProductModule, 
    AdminModule, 
    OrderModule, 
    PaymentsModule, 
    FilesModule, 
    JobsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
