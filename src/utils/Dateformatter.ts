// import { CreatedAt } from 'src/facturas/dto/data-factura.dto';

export class CreatedAt {
  _seconds: number;

  _nanoseconds: number;
}
export class DateFormatter {
  static getDDMMYYYY(date: Date): string {
    const formatter = new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
    return formatter.format(date);
  }
  static timestampToPureDate(timestamp: CreatedAt): Date {
    if (!timestamp) return new Date();

    const date = new Date(
      timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6,
    );
    return date;
  }
  static timestampToDate(timestamp: CreatedAt): string {
    if (!timestamp) return this.getDDMMYYYY(new Date());

    const date = new Date(
      timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6,
    );
    return this.getDDMMYYYY(date);
  }

  static dateFormartToInsertDrizzle(date: Date): string {
    if (!date) {
      throw new Error('Date is required');
    }
    return date.toISOString().split('T')[0];
  }
}
