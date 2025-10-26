import { ArrayMinSize, IsArray, IsEnum, IsString } from 'class-validator';

export enum EnumCartas {
  embargo_titular = 'embargo_titular',
  prejuridico_titular = 'prejuridico_titular',
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
