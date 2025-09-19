import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PacksModule } from './packs/packs.module';

@Module({
  imports: [PacksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
