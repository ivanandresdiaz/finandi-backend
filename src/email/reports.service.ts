import { Injectable } from '@nestjs/common';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { PrinterPdfService } from 'src/printer-pdf/printer-pdf.service';
import { DateFormatter } from 'src/utils/Dateformatter';
import formatNumber from 'src/utils/formatNumber';
import numeroToLetras from 'src/utils/numeroToLetras';
import { resolvePathAssets } from 'src/utils/resolvePathAssets';

@Injectable()
export class ReportesService {
  constructor(
    private readonly printerPdfService: PrinterPdfService,
    // private readonly whatsappService: WhatsappService,
  ) {}
  private loadImageAssets() {
    return {
      lider_cartera_firma: resolvePathAssets(
        '../../assets/images/firmaMilagros.png',
      ),
    };
  }

  private pdfDocumentToBuffer(
    pdfDocument: PDFKit.PDFDocument,
  ): Promise<Buffer> {
    pdfDocument.info.Title = 'Cartera';
    pdfDocument.info.Author = 'Coompartir';
    // pdfDocument.info.Subject = 'Notificación de carta';
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
  async coasistir_embargo_titular(values: {
    CIUDAD: string;
    'SALDO LIBRANZA': number;
    CEDULA: number;
    PAGADURIA: string;
    NOMBRE: string;
    PAGARE: string;
    tipo_participante: string;
    'CORREO DEUDOR': string;
  }) {
    const monto = values['SALDO LIBRANZA'];
    const formattedDate = DateFormatter.getDDMMYYYY(new Date());
    const formattedNumber = formatNumber(monto);
    const letraMonto = numeroToLetras(monto);
    const docDefinition: TDocumentDefinitions = {
      images: this.loadImageAssets(),
      defaultStyle: {
        // font: 'Helvetica',
        fontSize: 11,
        alignment: 'justify',
        lineHeight: 1.4,
      },
      content: [
        {
          text: `${values.CIUDAD}, ${formattedDate}`,
          alignment: 'right',
          margin: [0, 0, 0, 20],
        },
        {
          text: [
            'Señor\n',
            { text: 'PAGADOR\n', bold: true },
            {
              text: `${values.PAGADURIA}\n`,
              bold: true,
            },
            `Ciudad ${values.CIUDAD} \n`,
          ],
          margin: [0, 0, 0, 20],
        },
        {
          text: [
            { text: 'REF. ', bold: true },
            'Descuentos a favor de Cooperativas (Ley 79/88)',
            {
              text: `Cooperativa Multiactiva Coasistir Ltda “COASISTIR LTDA”\n\n`,
              bold: true,
            },
          ],
        },
        {
          text: [
            `Con fundamento en lo estipulado por los artículos 142 de la ley 79 de 1988 (ley cooperativa) y literal b del artículo 59 del código sustantivo del trabajo, en forma por demás comedida solicito que de cualquier cantidad que haya de pagarse por concepto de pensiones, prestaciones, primas, retroactivos, sobresueldos, indemnizaciones, bonificaciones o cualquier otro emolumento al trabajador de esa entidad, a `,
            {
              text: `${values.NOMBRE} `,
              bold: true,
            },
            'con cédula de ciudadanía número',
            { text: `C.C. ${formatNumber(values.CEDULA)}`, bold: true },
            ', se sirva deducir y retener en su calidad de',
            { text: ` ${values.tipo_participante} `, bold: true },
            'de la obligación y con destino a esta entidad hasta el 50% de su salario, pensión, honorarios, comisiones o cualquier otro emolumento hasta cubrir la suma',
            { text: `${letraMonto} ($${formattedNumber})`, bold: true },
            ', correspondiente al pagaré',
            { text: ` No. ${values.PAGARE} `, bold: true },
            'a la ',
            { text: 'COOPERATIVA MULTIACTIVA COASISTIR LTDA', bold: true },
            ' y la cual se encuentra en mora.\n\n',
          ],
        },
        {
          text: [
            `Lo retenido deberá ser consignado en el banco`,
            { text: ' CAJA SOCIAL', bold: true },
            `, cuenta AHORROS No.`,
            { text: ' 24048578246 ', bold: true },
            'a nombre de la',
            { text: ' COOPERATIVA MULTIACTIVA COASISTIR LTDA', bold: true },
            ', y por favor enviar los soportes de embargo al correo ',
            {
              text: 'cartera.coasistir@outlook.es.',
              decoration: 'underline',
              bold: true,
              link: 'mailto:cartera.coasistir@outlook.es',
            },
            {
              text: `Cabe aclarar que cualquier acuerdo al que se llegue se enviará con este tipo de documento con su numeración interna; NUNCA haremos acuerdos verbales. Igualmente, cualquier acuerdo de descuento se hará directamente por medio de ustedes y no de forma personal con su empleado.\n\n`,
            },
          ],
        },

        {
          text: [
            `No sobra recalcar que de conformidad con el parágrafo del artículo 142 citado, el incumplimiento de lo anterior hace deudor solidario del crédito a la empresa y/o pagador, conllevando por lo tanto a que esta cooperativa inicie acción judicial contra los mismos, según lo permite el artículo 142 de la ley 79 de 1988.`,
            {
              text: `Teniendo en cuenta lo anterior, es importante dar respuesta por escrito a esta solicitud en un término no superior a los tres días hábiles después de recibido este oficio a la dirección CR 18 No. 36-64 OFIC 208.\n\n`,
              decoration: 'underline',
              bold: true,
            },
          ],
        },
        {
          image: 'lider_cartera_firma',
          width: 277,
          alignment: 'left',
        },

        {
          text: 'REPRESENTANTE LEGAL',
          alignment: 'left',
          margin: [0, 0, 0, 0],
        },
      ],
    };
    const pdf = this.printerPdfService.createPdf(docDefinition);
    return this.pdfDocumentToBuffer(pdf);
  }
  async prejuridico_codeudor(values: {
    nombre_titular: string;
    celular_titular: string;
    direccion: string;
    nombre_codeudor: string;
    pagare_numero: number;
    cuotas_atrasadas: number;
    monto_atrasados: string;
    email_titular: string;
    email_receptor: string;
  }) {
    const formattedDate = DateFormatter.getDDMMYYYY(new Date());
    const docDefinition: TDocumentDefinitions = {
      images: this.loadImageAssets(),
      defaultStyle: {
        fontSize: 12,
        alignment: 'justify',
        lineHeight: 1.4,
      },
      content: [
        {
          text: `Bucaramanga, ${formattedDate}`,
          alignment: 'right',
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            [
              { text: 'Señor(a)', margin: [0, 0, 0, 4] },
              { text: values.nombre_titular, bold: true },
              { text: values.direccion, bold: true },
              {
                text: `TELEFONO: ${values.celular_titular} - ${values.email_titular}`,
                bold: true,
              },
              { text: `CODEUDOR DE ${values.nombre_codeudor}`, bold: true },
              { text: 'BUCARAMANGA', margin: [0, 0, 0, 8], bold: true },
            ],
          ],
        },
        {
          text: 'Referencia: COBRO PREJURIDICO',
          bold: true,
          margin: [0, 0, 0, 8],
        },
        {
          text: [
            `Comedidamente, me permito informarle que la`,
            {
              text: ` COOPERATIVA MULTIACTIVA COASISTIR`,
              bold: true,
            },
            `, en esta fecha me ha conferido poder amplio y suficiente para que inicie en su representación acción Civil en su contra, tendiente a obtener el pago de la obligación contenida en el pagaré`,
            { text: ` No ${values.pagare_numero} `, bold: true },
            `suscrito por usted.

A efecto de evitarle molestias de carácter judicial dispone del término prudencial de Tres (3) días hábiles para acercarse a las oficinas de mi poderdante ubicadas en la carrera 18 # 36-64 oficina 2-08 en B/manga, Teléfonos 6906601-6802646, a cancelar la deuda. Si ya realizó el pago, haga caso omiso a este documento. Este cobro pre jurídico tiene un valor de $17.000 =. Tener en cuenta que este documento se cobrará en el próximo pago que realice.

De no ponerse al día en el crédito, se procederá a pasar la solicitud de embargo tanto a usted como a su titular debido al atraso tan alto que presenta. Si cambió de lugar de residencia, de número de contacto o correo electrónico es su deber informar inmediatamente a la cooperativa, de lo contrario no nos hacemos responsables por no tener los datos actualizados de notificación.`,
          ],
          margin: [0, 0, 0, 12],
        },
        {
          table: {
            widths: ['*', 'auto'],
            body: [
              [
                { text: 'CUOTAS ATRASADAS', bold: true },
                { text: 'TOTAL A CUOTAS', bold: true },
              ],
              [
                { text: `${values.cuotas_atrasadas} CUOTAS DE MORA` },
                { text: `${formatNumber(values.monto_atrasados)}` },
              ],
            ],
          },
          layout: {
            // fillColor: null,(rowIndex) => (rowIndex === 0 ? '#eeeeee' : null),
          },
          margin: [0, 0, 0, 20],
        },
        {
          image: 'lider_cartera_firma',
          width: 277,
          alignment: 'left',
        },

        {
          text: 'REPRESENTANTE LEGAL',
          alignment: 'left',
          margin: [0, 0, 0, 0],
        },
        {
          text: 'T.P. 128.011 DEL C.S. DE LA J',
          alignment: 'left',
          bold: true,
          margin: [0, 0, 0, 0],
        },
      ],
    };
    const pdf = this.printerPdfService.createPdf(docDefinition);
    return this.pdfDocumentToBuffer(pdf);
  }
}
