import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import makeWASocket, {
  ConnectionState,
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  fetchLatestBaileysVersion,
  proto,
  downloadMediaMessage,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import P from 'pino';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import {
  IWhatsAppProvider,
  WhatsAppStatus,
  SendPdfDto,
  SendResult,
} from './whatsapp.types';

/**
 * Provider de WhatsApp usando Baileys
 * Maneja la conexión, autenticación y sesión persistente
 */
@Injectable()
export class WhatsAppProvider implements IWhatsAppProvider, OnModuleDestroy {
  private readonly logger = new Logger(WhatsAppProvider.name);
  private socket: WASocket | null = null;
  private qrCode: string | null = null;
  private status: WhatsAppStatus = 'disconnected';
  private authStatePath: string;

  constructor() {
    // Directorio para persistir la sesión de autenticación
    this.authStatePath = path.join(process.cwd(), 'whatsapp-session');
    this.ensureSessionDirectory();
  }

  /**
   * Asegura que el directorio de sesión exista
   */
  private ensureSessionDirectory(): void {
    if (!fs.existsSync(this.authStatePath)) {
      fs.mkdirSync(this.authStatePath, { recursive: true });
      this.logger.log(`Directorio de sesión creado: ${this.authStatePath}`);
    }
  }

  /**
   * Inicializa el cliente WhatsApp con soporte multi-device
   */
  async initialize(): Promise<void> {
    try {
      this.logger.log('Inicializando cliente WhatsApp...');
      this.status = 'connecting';

      // Cargar estado de autenticación persistente
      const { state, saveCreds } = await useMultiFileAuthState(
        this.authStatePath,
      );

      // Obtener la versión más reciente de Baileys
      const { version } = await fetchLatestBaileysVersion();
      this.logger.log(`Usando Baileys versión: ${version.join('.')}`);

      // Crear el socket de WhatsApp
      this.socket = makeWASocket({
        version,
        logger: P({ level: 'silent' }), // Silenciar logs de Baileys, usamos nuestros
        printQRInTerminal: false, // No imprimir QR en terminal, lo manejamos nosotros
        auth: state,
        browser: ['Coasistir Bot', 'Desktop', '1.0.0'],
        getMessage: async (key) => {
          // Callback opcional para obtener mensajes
          return {
            conversation: 'Mensaje no disponible',
          };
        },
      });

      // Manejar actualizaciones de conexión
      this.socket.ev.on('connection.update', async (update) => {
        await this.handleConnectionUpdate(update, saveCreds);
      });

      // Guardar credenciales cuando se actualicen
      this.socket.ev.on('creds.update', saveCreds);

      this.logger.log('Cliente WhatsApp inicializado correctamente');
    } catch (error) {
      this.logger.error(`Error al inicializar cliente: ${error.message}`, error.stack);
      this.status = 'disconnected';
      throw error;
    }
  }

  /**
   * Maneja las actualizaciones de conexión
   */
  private async handleConnectionUpdate(
    update: Partial<ConnectionState>,
    saveCreds: () => Promise<void>,
  ): Promise<void> {
    const { connection, lastDisconnect, qr } = update;

    // Generar QR si está disponible
    if (qr) {
      this.qrCode = qr;
      this.logger.log('Código QR generado. Escanea con WhatsApp.');
    }

    // Manejar estado de conexión
    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;

      this.logger.log(
        `Conexión cerrada. Debe reconectar: ${shouldReconnect}`,
        lastDisconnect?.error,
      );

      this.status = 'disconnected';
      this.qrCode = null;

      if (shouldReconnect) {
        this.status = 'reconnecting';
        // Reconectar después de un delay
        setTimeout(() => {
          this.initialize().catch((err) => {
            this.logger.error('Error al reconectar:', err);
          });
        }, 3000);
      } else {
        this.logger.warn(
          'Sesión cerrada. Elimina la carpeta whatsapp-session para iniciar sesión de nuevo.',
        );
        // Limpiar sesión si fue cerrada por el usuario
        this.cleanupSession();
      }
    } else if (connection === 'open') {
      this.logger.log('✅ WhatsApp conectado exitosamente');
      this.status = 'connected';
      this.qrCode = null; // Ya no necesitamos el QR
    } else if (connection === 'connecting') {
      this.status = 'connecting';
      this.logger.log('🔄 Conectando a WhatsApp...');
    }
  }

  /**
   * Limpia la sesión almacenada
   */
  private cleanupSession(): void {
    try {
      if (fs.existsSync(this.authStatePath)) {
        fs.rmSync(this.authStatePath, { recursive: true, force: true });
        this.logger.log('Sesión eliminada. Necesitas escanear QR nuevamente.');
      }
    } catch (error) {
      this.logger.error('Error al limpiar sesión:', error);
    }
  }

  /**
   * Obtiene el código QR para autenticación
   */
  getQrCode(): string | null {
    return this.qrCode;
  }

  /**
   * Obtiene el estado actual de conexión
   */
  getStatus(): WhatsAppStatus {
    return this.status;
  }

  /**
   * Valida formato de número de teléfono
   * Formato esperado: código de país + número (ej: 573001234567)
   */
  validatePhone(phone: string): boolean {
    // Eliminar espacios, guiones, paréntesis, etc.
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Debe tener entre 10 y 15 dígitos
    if (!/^\d{10,15}$/.test(cleanPhone)) {
      return false;
    }

    // Debe incluir código de país (generalmente empieza con 5 para Colombia)
    return cleanPhone.length >= 10;
  }

  /**
   * Formatea el número de teléfono al formato internacional de WhatsApp
   */
  private formatPhoneNumber(phone: string): string {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Si no tiene código de país, asumir Colombia (57)
    if (cleanPhone.length === 10) {
      return `57${cleanPhone}@s.whatsapp.net`;
    }
    
    // Ya tiene código de país
    return `${cleanPhone}@s.whatsapp.net`;
  }

  /**
   * Descarga un archivo desde una URL y lo convierte a Buffer
   */
  private async downloadFile(url: string): Promise<Buffer> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000, // 30 segundos timeout
      });
      return Buffer.from(response.data, 'binary');
    } catch (error) {
      this.logger.error(`Error al descargar archivo desde ${url}:`, error.message);
      throw new Error(`No se pudo descargar el PDF: ${error.message}`);
    }
  }

  /**
   * Envía un documento PDF como archivo (no imagen)
   */
  async sendPdf(params: SendPdfDto): Promise<SendResult> {
    const { phone, pdfUrl, filename, caption } = params;

    try {
      // Validar que el socket esté conectado
      if (!this.socket || this.status !== 'connected') {
        throw new Error('WhatsApp no está conectado. Estado: ' + this.status);
      }

      // Validar formato de teléfono
      if (!this.validatePhone(phone)) {
        throw new Error(`Número de teléfono inválido: ${phone}`);
      }

      this.logger.log(
        `Descargando PDF desde: ${pdfUrl} para enviar a ${phone}`,
      );

      // Descargar el PDF desde la URL
      const pdfBuffer = await this.downloadFile(pdfUrl);

      // Formatear número de teléfono
      const formattedPhone = this.formatPhoneNumber(phone);

      this.logger.log(`Enviando PDF "${filename}" a ${formattedPhone}`);

      // Enviar como documento usando Baileys
      const message = await this.socket.sendMessage(formattedPhone, {
        document: pdfBuffer,
        fileName: filename,
        mimetype: 'application/pdf',
        caption: caption || `📄 ${filename}`,
      });

      // Extraer ID del mensaje enviado
      const messageId = message.key.id || 'unknown';

      this.logger.log(
        `✅ PDF enviado exitosamente. MessageID: ${messageId} a ${phone}`,
      );

      return {
        success: true,
        messageId,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `❌ Error al enviar PDF a ${phone}: ${error.message}`,
        error.stack,
      );

      return {
        success: false,
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Limpieza al destruir el módulo
   */
  async onModuleDestroy(): Promise<void> {
    this.logger.log('Cerrando conexión de WhatsApp...');
    if (this.socket) {
      this.socket.end(undefined);
      this.socket = null;
    }
    this.status = 'disconnected';
  }
}

