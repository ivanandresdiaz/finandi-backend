import { Test, TestingModule } from '@nestjs/testing';
import { PrinterPdfService } from './printer-pdf.service';

describe('PrinterPdfService', () => {
  let service: PrinterPdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrinterPdfService],
    }).compile();

    service = module.get<PrinterPdfService>(PrinterPdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
