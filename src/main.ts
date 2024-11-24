import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { loadApiDocumentation } from './utils';
import { LoggingService } from './logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggingService = app.get(LoggingService);
  app.useLogger(loggingService);

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);

  const apiDoc = await loadApiDocumentation();
  SwaggerModule.setup('doc', app, apiDoc);

  await app.listen(port, () => {
    console.log(`\x1b[35m 🚀 App is running on port ${port}! \x1b[0m`);
  });
}

bootstrap();
