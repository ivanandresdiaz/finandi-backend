/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { ReportesService } from './reports.service';
import { GraphService } from '../graph/graph.service';
import { EmailCarteraCartasSendDto, EnumCartas } from './dto/create-email.dto';
import { from, lastValueFrom, mergeMap, toArray } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';
import { Timestamp } from 'firebase-admin/firestore';

const cartas = [
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
      {
        value: 'tipo_participante',
        type: 'string',
        default_value: 'TITULAR',
        order: 8,
      },

      {
        value: 'CORREO DEUDOR',
        type: 'email',
        default_value: 'miexample@gmail.com',
        order: 9,
      },
    ],
  },
  {
    id: 'embargo_codeudor',
    asunto: 'Cartera Coompartir',
    values: [
      { value: 'monto', type: 'number', default_value: 11550000, order: 1 },
      {
        value: 'cedula_titular',
        type: 'number',
        default_value: 1095812565,
        order: 2,
      },
      {
        value: 'empresa_nombre',
        type: 'string',
        default_value: 'TECNOLOGIAS INTEGRALES DE SEGURIDAD DE COLOMBIA LTDA',
        order: 3,
      },
      {
        value: 'nombre_titular',
        type: 'string',
        default_value: 'NESTOR ENRIQUE ORTIZ SUAREZ',
        order: 4,
      },
      {
        value: 'tipo_participante',
        type: 'string',
        default_value: 'TITULAR',
        order: 5,
      },
      {
        value: 'pagare_numero',
        type: 'number',
        default_value: 33221,
        order: 6,
      },
      {
        value: 'CORREO DEUDOR',
        type: 'email',
        default_value: 'miexample@gmail.com',
        order: 7,
      },
    ],
  },
  {
    id: 'prejuridico_titular',
    asunto: 'Prejurídico Coompartir',
    values: [
      {
        value: 'nombre_titular',
        type: 'string',
        default_value: 'Nombre Juan',
        order: 1,
      },
      {
        value: 'celular_titular',
        type: 'number',
        default_value: 3001234567,
        order: 1,
      },
      {
        value: 'direccion',
        type: 'string',
        default_value: 'Calle Juan',
        order: 2,
      },
      {
        value: 'nombre_codeudor',
        type: 'string',
        default_value: 'NESTOR CODEUDOR',
        order: 3,
      },

      {
        value: 'pagare_numero',
        type: 'number',
        default_value: 33221,
        order: 4,
      },
      {
        value: 'cuotas_atrasadas',
        type: 'number',
        default_value: 33221,
        order: 5,
      },
      {
        value: 'monto_atrasados',
        type: 'number',
        default_value: 33221,
        order: 5,
      },

      {
        value: 'email_titular',
        type: 'email',
        default_value: 'miexample@gmail.com',
        order: 6,
      },
      {
        value: 'email_receptor',
        type: 'email',
        default_value: 'miexample@gmail.com',
        order: 7,
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
                  await this.reportesService.coasistir_embargo_titular(row);
                console.log('row', row);
                const buffer = pdf.toString('base64');
                await this.graphService.sendMail({
                  accessToken: access_token,
                  pdfBase64: buffer,
                  to: row['CORREO DEUDOR'],
                  subject: carta.asunto + ` - ${row['NOMBRE']}`,
                  body: `Estimado(a) ${row['NOMBRE']}, adjunto encontrará la carta de notificación correspondiente.`,
                });
              }
              // Mapear los valores de la fila a los valores esperados en el reporte
              if (carta_id === EnumCartas.prejuridico_titular) {
                const pdf =
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  await this.reportesService.prejuridico_codeudor(row);
                const buffer = pdf.toString('base64');
                await this.graphService.sendMail({
                  accessToken: access_token,
                  pdfBase64: buffer,
                  to: row['email_receptor'],
                  subject: carta.asunto + ` - ${row['nombre_titular']}`,
                  body: `Estimado(a) ${row['nombre_titular']}, adjunto encontrará la carta de notificación correspondiente.`,
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
