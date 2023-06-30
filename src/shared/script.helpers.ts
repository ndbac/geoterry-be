import { config as envConfig } from 'dotenv';
envConfig();
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from 'src/modules/app.module';
import { errorLog } from './logger/logger.helpers';

type Script = (app: INestApplication) => Promise<void>;

export const runScript = (f: Script, name?: string) => {
  NestFactory.create<NestExpressApplication>(AppModule).then(async (app) => {
    await app.init();
    await f(app)
      .then(() => process.exit(0))
      .catch((e) => {
        errorLog(e, { scriptName: name }, 'Script error happened');
        console.error(e);
        process.exit(-1);
      });
  });
};
