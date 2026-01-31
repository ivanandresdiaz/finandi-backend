import { ArrayMinSize, IsArray, IsEnum, IsString } from 'class-validator';

export enum EnumCartas {
  coasistir_embargo_titular = 'coasistir_embargo_titular',
  coasistir_embargo_codeudor = 'coasistir_embargo_codeudor',
  coasistir_prejuridico_codeudor = 'coasistir_prejuridico_codeudor',
  coasistir_prejuridico_titular = 'coasistir_prejuridico_titular',
  compartir_embargo_titular = 'compartir_embargo_titular',
  compartir_embargo_codeudor = 'compartir_embargo_codeudor',
  compartir_prejuridico_codeudor = 'compartir_prejuridico_codeudor',
  compartir_prejuridico_titular = 'compartir_prejuridico_titular',
}

export class EmailCarteraCartasSendDto {
  @IsString()
  access_token: string;

  @IsEnum(EnumCartas)
  carta_id: EnumCartas;

  @IsString()
  sender_email: string;

  @IsString()
  name: string;

  // rows: any[]
  @IsArray()
  @ArrayMinSize(1)
  rows: any[];
}
