import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionStatus } from '@algoan/rest';
import { EventName } from '../../hooks/enums/event-name.enum';
import { config } from 'node-config-ts';

import { CONFIG } from '../../config/config.module';

import { AlgoanService } from './algoan.service';

describe('AlgoanService', () => {
  let algoanService: AlgoanService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AlgoanService,
        {
          provide: CONFIG,
          useValue: config,
        },
      ],
    }).compile();

    algoanService = moduleRef.get<AlgoanService>(AlgoanService);
  });

  it('should be defined', () => {
    expect(algoanService).toBeDefined();
  });

  it('should start properly', async () => {
    jest.spyOn(algoanService, 'initRestHooks').mockReturnValue(Promise.resolve());
    await expect(algoanService.onModuleInit()).resolves.toEqual(undefined);
  });

  it('should throw an error', async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AlgoanService,
        {
          provide: CONFIG,
          useValue: {
            ...config,
            eventList: [],
          },
        },
      ],
    }).compile();

    algoanService = moduleRef.get<AlgoanService>(AlgoanService);

    await expect(algoanService.onModuleInit()).rejects.toThrow('No event list given');
  });

  it('should handle the service account created event', async () => {
    const subscriptionId: string = '3';

    const payload = {
      serviceAccountId: 'serviceAccountId',
    };

    const subscription = {
      id: subscriptionId,
      target: config.targetUrl,
      status: 'ACTIVE' as SubscriptionStatus,
      eventName: EventName.SERVICE_ACCOUNT_CREATED,
    };

    algoanService.saveServiceAccount(payload, subscription);
  });
});
