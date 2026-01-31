/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { ReportesService } from './reports.service';
import { GraphService } from '../graph/graph.service';
import { EmailCarteraCartasSendDto, EnumCartas } from './dto/create-email.dto';
import { from, lastValueFrom, mergeMap, toArray } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';
import { Timestamp } from 'firebase-admin/firestore';
const cartasCompartir = [
  {
    id: "compartir_embargo_titular",
    empresa: "compartir",
    asunto: "Notificación de Embargo",
    values: [
      {
        value: "SALDO LIBRANZA",
        type: "number",
        default_value: 100_000_0,
        order: 2,
      },
      {
        value: "CEDULA",
        type: "number",
        default_value: 1119187766,
        order: 3,
      },
      {
        value: "PAGADURIA",
        type: "string",
        default_value: "EMPRESA XYZ S.A.S",
        order: 4,
      },
      {
        value: "NOMBRE",
        type: "string",
        default_value: "JUAN PEREZ",
        order: 5,
      },
      {
        value: "CIUDAD",
        type: "string",
        default_value: "Bucaramanga",
        order: 6,
      },
      {
        value: "PAGARE",
        type: "number",
        default_value: 33221,
        order: 7,
      },

      {
        value: "CORREO DEUDOR",
        type: "email",
        default_value: "miexample@gmail.com",
        order: 9,
      },
    ],
  },
  {
    id: "compartir_embargo_codeudor",
    empresa: "compartir",
    asunto: "Notificación de Embargo",
    values: [
      {
        value: "SALDO LIBRANZA",
        type: "number",
        default_value: 100_000_0,
        order: 2,
      },
      {
        value: "CEDULA",
        type: "number",
        default_value: 1119187766,
        order: 3,
      },
      {
        value: "PAGADURIA",
        type: "string",
        default_value: "EMPRESA XYZ S.A.S",
        order: 4,
      },
      {
        value: "CODEUDOR",
        type: "string",
        default_value: "JUAN PEREZ",
        order: 5,
      },
      {
        value: "CIUDAD",
        type: "string",
        default_value: "Bucaramanga",
        order: 6,
      },
      {
        value: "PAGARE",
        type: "number",
        default_value: 33221,
        order: 7,
      },

      {
        value: "CORREO CODEUDOR",
        type: "email",
        default_value: "miexample@gmail.com",
        order: 9,
      },
    ],
  },
  {
    id: "compartir_prejuridico_codeudor",
    empresa: "compartir",
    asunto: "Notificación de Prejurídico",
    values: [
      {
        value: "NOMBRE",
        type: "string",
        default_value: "Nombre Juan",
        order: 1,
      },
      {
        value: "TELEFONO 1",
        type: "number",
        default_value: 3001234567,
        order: 1,
      },
      {
        value: "DIRECCION",
        type: "string",
        default_value: "Calle Juan",
        order: 2,
      },
      {
        value: "CODEUDOR",
        type: "string",
        default_value: "NESTOR CODEUDOR",
        order: 3,
      },

      {
        value: "PAGARE",
        type: "number",
        default_value: 33221,
        order: 4,
      },
      {
        value: "CUOTAS ATRAZADAS",
        type: "number",
        default_value: 33221,
        order: 5,
      },
      {
        value: "MONTO ATRAZADO",
        type: "number",
        default_value: 33221,
        order: 5,
      },
      {
        value: "CORREO CODEUDOR",
        type: "email",
        default_value: "miexample@gmail.com",
        order: 6,
      },
    ],
  },
  {
    id: "compartir_prejuridico_titular",
    empresa: "compartir",
    asunto: "Notificación de Prejurídico",
    values: [
      {
        value: "NOMBRE",
        type: "string",
        default_value: "Nombre Juan",
        order: 1,
      },
      {
        value: "TELEFONO 1",
        type: "number",
        default_value: 3001234567,
        order: 1,
      },
      {
        value: "DIRECCION",
        type: "string",
        default_value: "Calle Juan",
        order: 2,
      },
      {
        value: "PAGARE",
        type: "number",
        default_value: 33221,
        order: 4,
      },
      {
        value: "CUOTAS ATRAZADAS",
        type: "number",
        default_value: 33221,
        order: 5,
      },
      {
        value: "MONTO ATRAZADO",
        type: "number",
        default_value: 33221,
        order: 5,
      },
      {
        value: "CORREO DEUDOR",
        type: "email",
        default_value: "miexample@gmail.com",
        order: 6,
      },
    ],
  },
];
const cartas = [
  ...cartasCompartir,
  {
    id: 'coasistir_embargo_titular',
    asunto: 'Coasistir - Notificación de Embargo',
    values: [
      {
        value: 'SALDO LIBRANZA',
        type: 'number',
        default_value: 100_000_0,
        order: 2,
      },
      {
        value: 'CEDULA',
        type: 'number',
        default_value: 1119187766,
        order: 3,
      },
      {
        value: 'PAGADURIA',
        type: 'string',
        default_value: 'EMPRESA XYZ S.A.S',
        order: 4,
      },
      {
        value: 'NOMBRE',
        type: 'string',
        default_value: 'JUAN PEREZ',
        order: 5,
      },
      {
        value: 'CIUDAD',
        type: 'string',
        default_value: 'BUCARAMANGA',
        order: 6,
      },
      {
        value: 'PAGARE',
        type: 'number',
        default_value: 33221,
        order: 7,
      },
      // {
      //   value: 'tipo_participante',
      //   type: 'string',
      //   default_value: 'TITULAR',
      //   order: 8,
      // },

      {
        value: 'CORREO DEUDOR',
        type: 'email',
        default_value: 'miexample@gmail.com',
        order: 9,
      },
    ],
  },
  {
    id: 'coasistir_embargo_codeudor',
    asunto: 'Coasistir - Notificación de Embargo',
    values: [
      {
        value: 'SALDO LIBRANZA',
        type: 'number',
        default_value: 100_000_0,
        order: 2,
      },
      {
        value: 'CEDULA',
        type: 'number',
        default_value: 1119187766,
        order: 3,
      },
      {
        value: 'PAGADURIA',
        type: 'string',
        default_value: 'EMPRESA XYZ S.A.S',
        order: 4,
      },
      {
        value: 'CODEUDOR',
        type: 'string',
        default_value: 'JUAN PEREZ',
        order: 5,
      },
      {
        value: 'CIUDAD',
        type: 'string',
        default_value: 'Bucaramanga',
        order: 6,
      },
      {
        value: 'PAGARE',
        type: 'number',
        default_value: 33221,
        order: 7,
      },

      {
        value: 'CORREO CODEUDOR',
        type: 'email',
        default_value: 'miexample@gmail.com',
        order: 9,
      },
    ],
  },
  {
    id: 'coasistir_prejuridico_codeudor',
    asunto: 'Prejurídico Coasistir',
    values: [
      {
        id: 'coasistir_prejuridico_codeudor',
        empresa: 'coasistir',
        values: [
          {
            value: 'NOMBRE',
            type: 'string',
            default_value: 'Nombre Juan',
            order: 1,
          },
          {
            value: 'TELEFONO 1',
            type: 'number',
            default_value: 3001234567,
            order: 1,
          },
          {
            value: 'DIRECCION',
            type: 'string',
            default_value: 'Calle Juan',
            order: 2,
          },
          {
            value: 'CODEUDOR',
            type: 'string',
            default_value: 'NESTOR CODEUDOR',
            order: 3,
          },

          {
            value: 'PAGARE',
            type: 'number',
            default_value: 33221,
            order: 4,
          },
          {
            value: 'CUOTAS ATRAZADAS',
            type: 'number',
            default_value: 33221,
            order: 5,
          },
          {
            value: 'MONTO ATRAZADO',
            type: 'number',
            default_value: 33221,
            order: 5,
          },
          {
            value: 'CORREO CODEUDOR',
            type: 'email',
            default_value: 'miexample@gmail.com',
            order: 6,
          },
        ],
      },
    ],
  },
  {
    id: 'coasistir_prejuridico_titular',
    asunto: 'Prejurídico Coasistir',
    values: [
      {
        value: 'NOMBRE',
        type: 'string',
        default_value: 'Nombre Juan',
        order: 1,
      },
      {
        value: 'TELEFONO 1',
        type: 'number',
        default_value: 3001234567,
        order: 1,
      },
      {
        value: 'DIRECCION',
        type: 'string',
        default_value: 'Calle Juan',
        order: 2,
      },
      {
        value: 'PAGARE',
        type: 'number',
        default_value: 33221,
        order: 4,
      },
      {
        value: 'CUOTAS ATRAZADAS',
        type: 'number',
        default_value: 33221,
        order: 5,
      },
      {
        value: 'MONTO ATRAZADO',
        type: 'number',
        default_value: 33221,
        order: 5,
      },
      {
        value: 'CORREO DEUDOR',
        type: 'email',
        default_value: 'miexample@gmail.com',
        order: 6,
      },
    ],
  },
];

@Injectable()
export class EmailService {
  constructor(
    private readonly reportesService: ReportesService,
    private readonly graphService: GraphService,
    private readonly firebaseService: FirebaseService,
  ) {}
  private logger = new Logger(EmailService.name);
  async getEnviosMasivos() {
    try {
      const dbFire = this.firebaseService.getFirestore();
      const snapshot = await dbFire
        .collection('cartera_envios')
        .orderBy('created_at', 'desc')
        .limit(60)
        .get();
      const envios = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return envios;
    } catch (error) {
      this.logger.error('Error al obtener envíos masivos', error);
      throw new Error('Error al obtener envíos masivos');
    }
  }
  async sendEmailsReports(
    emailCarteraCartasSendDto: EmailCarteraCartasSendDto,
  ) {
    const { access_token, rows, sender_email, name, carta_id } =
      emailCarteraCartasSendDto;
    const dbFire = this.firebaseService.getFirestore();
    const addRows = await dbFire.collection('cartera_envios').add({
      carta_id: emailCarteraCartasSendDto.carta_id,
      sender_email,
      created_at: Timestamp.now(),
      name,
    });
    console.log(
      ' emailCarteraCartasSendDto.carta_id',
      emailCarteraCartasSendDto.carta_id,
    );
    // Upload Rows
    const promises = rows.map(async (values, i) => {
      const row = Object.assign({}, values);
      const uploadRows = await dbFire
        .collection('cartera_envios')
        .doc(addRows.id)
        .collection('rows')
        .add({
          data: row,
          index: i,
          created_at: Timestamp.now(),
          status: 'Pendiente',
        });
      return {
        id: uploadRows.id,
        row,
      };
    });
    const envios = await Promise.all(promises);
    const results = await lastValueFrom(
      from(envios).pipe(
        mergeMap(
          async (data) => {
            const { id, row } = data;
            try {
              const carta = cartas.find(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
                (c) => c.id === emailCarteraCartasSendDto.carta_id,
              );
              if (!carta) {
                throw new Error('Carta no encontrada');
              }
              if (carta_id === EnumCartas.coasistir_embargo_titular) {
                const pdf =
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  await this.reportesService.coasistir_embargo_titular({
                    row:row,
                    isCompartir:false,
                  });
                console.log('row', row);
                const buffer = pdf.toString('base64');
                await this.graphService.sendMail({
                  accessToken: access_token,
                  pdfBase64: buffer,
                  to: row['CORREO DEUDOR'],
                  subject: "Titular" + ` - ${row['NOMBRE']}`+ " - " + carta.asunto,
                  body: `Estimado(a) ${row['NOMBRE']}, adjunto encontrará la carta de notificación correspondiente.`,
                });
              }
              if (carta_id === EnumCartas.coasistir_embargo_codeudor) {
                
                const pdf =
                  await this.reportesService.coasistir_embargo_codeudor({
                    row:row,
                    isCompartir:false,
                  });
                const buffer = pdf.toString('base64');
                await this.graphService.sendMail({
                  accessToken: access_token,
                  pdfBase64: buffer,
                  to: row['CORREO CODEUDOR'],
                  subject: "Codeudor" + ` - ${row['CODEUDOR']}`+ " - " + carta.asunto,
                  body: `Estimado(a) ${row['CODEUDOR']}, adjunto encontrará la carta de notificación correspondiente.`,
                });
              }
              // Mapear los valores de la fila a los valores esperados en el reporte
              if (carta_id === EnumCartas.coasistir_prejuridico_codeudor) {
                const pdf =
                  await this.reportesService.coasistir_prejuridico_codeudor(
                    
                    {row:row, isCompartir:false},
                  );
                const buffer = pdf.toString('base64');
                await this.graphService.sendMail({
                  accessToken: access_token,
                  pdfBase64: buffer,
                  to: row['CORREO CODEUDOR'],
                  subject: "Codeudor" + ` - ${row['CODEUDOR']}`+ " - " + carta.asunto,
                  body: `Estimado(a) ${row['CODEUDOR']}, adjunto encontrará la carta de notificación correspondiente.`,
                });
              }
              if (carta_id === EnumCartas.coasistir_prejuridico_titular) {
                console.log('row', row);
                const pdf =
                  await this.reportesService.coasistir_prejuridico_titular(
                    {row:row, isCompartir:false},
                  );
                const buffer = pdf.toString('base64');
                await this.graphService.sendMail({
                  accessToken: access_token,
                  pdfBase64: buffer,
                  to: row['CORREO DEUDOR'],
                  subject: "Titular" + ` - ${row['NOMBRE']}`+ " - " + carta.asunto,
                  body: `Estimado(a) ${row['NOMBRE']}, adjunto encontrará la carta de notificación correspondiente.`,
                });
              }
// COMPARTIR 
if (carta_id === EnumCartas.compartir_embargo_titular) {
  const pdf =
    
    await this.reportesService.coasistir_embargo_titular({row:row, isCompartir:true});
  console.log('row', row);
  const buffer = pdf.toString('base64');
  await this.graphService.sendMail({
    accessToken: access_token,
    pdfBase64: buffer,
    to: row['CORREO DEUDOR'],
    subject: "Titular" + ` - ${row['NOMBRE']}`+ " - " + carta.asunto,
    body: `Estimado(a) ${row['NOMBRE']}, adjunto encontrará la carta de notificación correspondiente.`,
  });
}
if (carta_id === EnumCartas.compartir_embargo_codeudor) {
  console.log('row', row);
  const pdf =
    
    await this.reportesService.coasistir_embargo_codeudor({row:row, isCompartir:true});
  const buffer = pdf.toString('base64');
  await this.graphService.sendMail({
    accessToken: access_token,
    pdfBase64: buffer,
    to: row['CORREO CODEUDOR'],
    subject: "Codeudor" + ` - ${row['CODEUDOR']}`+ " - " + carta.asunto,
    body: `Estimado(a) ${row['CODEUDOR']}, adjunto encontrará la carta de notificación correspondiente.`,
  });
}
// Mapear los valores de la fila a los valores esperados en el reporte
if (carta_id === EnumCartas.compartir_prejuridico_codeudor) {
  const pdf =
    await this.reportesService.coasistir_prejuridico_codeudor(
      {row:row, isCompartir:true},
      
    );
  const buffer = pdf.toString('base64');
  await this.graphService.sendMail({
    accessToken: access_token,
    pdfBase64: buffer,
    to: row['CORREO CODEUDOR'],
    subject: "Codeudor" + ` - ${row['CODEUDOR']}`+ " - " + carta.asunto,
    body: `Estimado(a) ${row['CODEUDOR']}, adjunto encontrará la carta de notificación correspondiente.`,
  });
}
if (carta_id === EnumCartas.compartir_prejuridico_titular) {
  console.log('row', row);
  const pdf =
    await this.reportesService.coasistir_prejuridico_titular(
      
      {row:row, isCompartir:true},
    );
  const buffer = pdf.toString('base64');
  await this.graphService.sendMail({
    accessToken: access_token,
    pdfBase64: buffer,
    to: row['CORREO DEUDOR'],
    subject: "Titular" + ` - ${row['NOMBRE']}`+ " - " + carta.asunto,
    body: `Estimado(a) ${row['NOMBRE']}, adjunto encontrará la carta de notificación correspondiente.`,
  });
}
              // .slice(0, 150);
              const uploadRows = await dbFire
                .collection('cartera_envios')
                .doc(addRows.id)
                .collection('rows')
                .doc(id)
                .set(
                  {
                    status: 'Enviado',
                  },
                  { merge: true },
                );
              return uploadRows;
            } catch (error) {
              console.log('Error al enviar el correo:', error);
              const uploadRows = await dbFire
                .collection('cartera_envios')
                .doc(addRows.id)
                .collection('rows')
                .doc(id)
                .set(
                  {
                    status: 'Fallido',
                  },
                  { merge: true },
                );

              return uploadRows;
            }
          },
          1, // procesar métodos de entrega uno a la vez
        ),
        toArray(),
      ),
    );
    return results;
  }
}
