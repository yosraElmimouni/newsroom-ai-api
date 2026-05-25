import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './services/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  // Démarrer d'abord, seeder ensuite (non-bloquant)
  await app.listen(process.env.PORT || 10000);

  try {
    const authService = app.get(AuthService);
    await authService.seedAdmin();
  } catch (e) {
    console.error('seedAdmin failed (non-fatal):', e.message);
  }
}

bootstrap();