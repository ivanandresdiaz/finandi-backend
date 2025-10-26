import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { GraphService } from 'src/graph/graph.service';
import { PrinterPdfModule } from 'src/printer-pdf/printer-pdf.module';
import { ReportesService } from './reports.service';

@Module({
  controllers: [EmailController],
  providers: [EmailService, GraphService, ReportesService],
  imports: [PrinterPdfModule],
})
export class EmailModule {}
