import { Injectable } from '@nestjs/common';

import PdfPrinter from 'pdfmake';
import type {
  BufferOptions,
  CustomTableLayout,
  TDocumentDefinitions,
  TFontDictionary,
} from 'pdfmake/interfaces';
import { resolvePathAssets } from 'src/utils/resolvePathAssets';

const customTableLayouts: Record<string, CustomTableLayout> = {
  light: {
    hLineWidth: function () {
      return 0.5;
    },
    vLineWidth: function () {
      return 0.5;
    },
    hLineColor: function () {
      return '#2E3E3C';
    },
    vLineColor: function () {
      return '#2E3E3C';
    },
  },

  customLayout01: {
    hLineWidth: function (i, node) {
      if (i === 0 || i === node.table.body.length) {
        return 0;
      }
      return i === node.table.headerRows ? 2 : 1;
    },
    vLineWidth: function () {
      return 0;
    },
    hLineColor: function (i) {
      return i === 1 ? 'black' : '#bbbbbb';
    },
    paddingLeft: function (i) {
      return i === 0 ? 0 : 8;
    },
    paddingRight: function (i, node) {
      return node &&
        node.table &&
        node.table.widths &&
        i === node.table.widths.length - 1
        ? 0
        : 8;
    },
    fillColor: function (i, node) {
      if (i === 0) {
        return '#7b90be';
      }
      if (i === node.table.body.length - 1) {
        return '#acb3c1';
      }

      return i % 2 === 0 ? '#f3f3f3' : null;
    },
  },
};

@Injectable()
export class PrinterPdfService {
  private printer: PdfPrinter;
  constructor() {
    // const fonts: TFontDictionary = {
    //   Roboto: {
    //     normal: resolvePathAssets(
    //       '../../assets/fonts/centauryGothic/CenturyGothic.ttf',
    //     ),
    //     bold: resolvePathAssets(
    //       '../../assets/fonts/centauryGothic/CenturyGothicBold.TTF',
    //     ),
    //     italics: resolvePathAssets(
    //       '../../assets/fonts/centauryGothic/CenturyGothicItalic.TTF',
    //     ),
    //   },
    // };
    const fonts: TFontDictionary = {
      Roboto: {
        normal: resolvePathAssets('../../assets/fonts/arial/ARIAL.TTF'),
        bold: resolvePathAssets('../../assets/fonts/arial/ARIALBD.TTF'),
        italics: resolvePathAssets('../../assets/fonts/arial/ARIALI.TTF'),
      },
    };
    // add printer
    this.printer = new PdfPrinter(fonts);
  }

  createPdf(
    docDefinition: TDocumentDefinitions,
    option: BufferOptions = {
      tableLayouts: customTableLayouts,
    },
  ): PDFKit.PDFDocument {
    return this.printer.createPdfKitDocument(docDefinition, option);
  }
  pdfDocumentToBuffer(params: {
    pdfDocument: PDFKit.PDFDocument;
    title: string;
    author: string;
    subject: string;
  }): Promise<Buffer> {
    const { pdfDocument } = params;
    pdfDocument.info.Title = params.title;
    pdfDocument.info.Author = params.author;
    pdfDocument.info.Subject = params.subject;
    pdfDocument.info.CreationDate = new Date();

    // pdfDocument.info.CreationDate = new Date();
    return new Promise((resolve, reject) => {
      const buffers: Buffer[] = [];
      pdfDocument.on('data', (chunk) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        buffers.push(chunk);
      });
      pdfDocument.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      pdfDocument.on('error', (error) => {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject(error);
      });
      pdfDocument.end();
    });
  }
}
