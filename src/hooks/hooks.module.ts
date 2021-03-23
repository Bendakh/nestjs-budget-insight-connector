import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { AlgoanModule } from '../algoan/algoan.module';
import { AggregatorModule } from '../aggregator/aggregator.module';
import { HooksController } from './controllers/hooks.controller';
import { HooksService } from './services/hooks.service';

/**
 * Hooks module
 */
@Module({
  imports: [AlgoanModule, AggregatorModule, ConfigModule],
  controllers: [HooksController],
  providers: [HooksService],
})
export class HooksModule {}
