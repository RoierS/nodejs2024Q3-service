import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { loadApiDocumentation } from './utils';
import { LoggingService } from './logging/logging.service';
import { ExceptionsFilter } from './exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggingService = app.get(LoggingService);
  app.useLogger(loggingService);
  app.useGlobalFilters(new ExceptionsFilter(loggingService));

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);

  const apiDoc = await loadApiDocumentation();
  SwaggerModule.setup('doc', app, apiDoc);

  process.on('uncaughtException', (err: Error) => {
    loggingService.error(
      `Uncaught Exception: ${err.message}`,
      err.stack,
      'Process',
    );
  });

  process.on('unhandledRejection', (reason) => {
    loggingService.error(
      `Unhandled Rejection: ${reason}`,
      undefined,
      'Process',
    );
  });

  await app.listen(port, () => {
    console.log(`\x1b[35m 🚀 App is running on port ${port}! \x1b[0m`);
  });
}

bootstrap();
