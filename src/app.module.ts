import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    EmailModule,
    FirebaseModule,
    ConfigModule.forRoot({
      isGlobal: true, // ✅ Hace disponible process.env en todo el proyecto
      envFilePath: '.env', // puedes usar ['.env', '.env.local'] si quieres
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
