import {
  Controller,
  Post,
  Body,
  Headers,
  UseGuards,
  Get,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';
import { EmailCarteraCartasSendDto } from './dto/create-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/cartera-cartas/send')
  @UseGuards(FirebaseAuthGuard())
  async sendEmail(
    @Body() emailCarteraCartasSendDto: EmailCarteraCartasSendDto,
  ) {
    return this.emailService.sendEmailsReports(emailCarteraCartasSendDto);
  }
  @Get('/envios')
  @UseGuards(FirebaseAuthGuard())
  async getEnviosCartera() {
    return this.emailService.getEnviosMasivos();
  }
}
