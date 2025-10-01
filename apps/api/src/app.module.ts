import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { AdminModule } from './admin/admin.module';
import { OrderModule } from './order/order.module';
import { PaymentsModule } from './payments/payments.module';
import { FilesModule } from './files/files.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [AuthModule, UserModule, ProductModule, AdminModule, OrderModule, PaymentsModule, FilesModule, JobsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
