/**
 * Tipos e interfaces para el módulo de WhatsApp
 * Diseñado para ser abstracto y permitir cambiar de Baileys a WhatsApp Cloud API
 */

/**
 * Estado de conexión del cliente WhatsApp
 */
export type WhatsAppStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'reconnecting';

/**
 * DTO para enviar un PDF
 */
export interface SendPdfDto {
  phone: string;
  pdfUrl: string;
  filename: string;
  caption?: string;
}

/**
 * Resultado de una operación de envío
 */
export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: Date;
}

/**
 * Estadísticas de envío diarias
 */
export interface DailyStats {
  date: string;
  totalSent: number;
  maxAllowed: number;
  remaining: number;
}

/**
 * Interfaz para el proveedor de WhatsApp (abstracción)
 * Permite cambiar de Baileys a WhatsApp Cloud API sin cambiar el service
 */
export interface IWhatsAppProvider {
  /**
   * Inicializa el cliente WhatsApp
   */
  initialize(): Promise<void>;

  /**
   * Obtiene el código QR para autenticación
   */
  getQrCode(): string | null;

  /**
   * Obtiene el estado actual de conexión
   */
  getStatus(): WhatsAppStatus;

  /**
   * Envía un documento PDF
   */
  sendPdf(params: SendPdfDto): Promise<SendResult>;

  /**
   * Valida que el número de teléfono tenga formato correcto
   */
  validatePhone(phone: string): boolean;
}

/**
 * Configuración de rate limiting
 */
export interface RateLimitConfig {
  minDelayMs: number; // 15 segundos
  maxDelayMs: number; // 25 segundos
  maxDailySends: number; // 60 envíos
  allowedHoursStart: number; // 8 (08:00)
  allowedHoursEnd: number; // 18 (18:00)
}

