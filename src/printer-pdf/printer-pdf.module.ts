import { Module } from '@nestjs/common';
import { PrinterPdfService } from './printer-pdf.service';

@Module({
  providers: [PrinterPdfService],
  exports: [PrinterPdfService],
})
export class PrinterPdfModule {}
