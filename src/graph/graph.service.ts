// src/graph/graph.service.ts
import { Injectable } from '@nestjs/common';
import { Client } from '@microsoft/microsoft-graph-client';
// import "isomorphic-fetch";

@Injectable()
export class GraphService {
  getGraphClient(accessToken: string) {
    return Client.init({
      authProvider: (done) => done(null, accessToken),
    });
  }

  async sendMail(params: {
    accessToken: string;
    pdfBase64: string;
    subject: string;
    to: string;
    body: string;
  }) {
    try {
      const { accessToken, pdfBase64, subject, to, body } = params;
      console.log('params', params);
      const client = this.getGraphClient(accessToken);
      const message = {
        message: {
          subject: subject,
          body: {
            contentType: 'html',
            content: body,
          },
          toRecipients: [
            {
              emailAddress: { address: to },
            },
          ],
          attachments: [
            {
              '@odata.type': '#microsoft.graph.fileAttachment',
              name: `Carta_${subject}.pdf`,
              contentType: 'application/pdf',
              contentBytes: pdfBase64,
            },
          ],
        },

        saveToSentItems: 'true',
      };
      await client.api('/me/sendMail').post(message);
      return { success: true };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
