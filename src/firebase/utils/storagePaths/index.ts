// import { EnumTipoSoportesAdicionalesType } from 'src/drizzle/schema/cartera/castigo.schema';
// import {
//   EnumCartasMetodoEntregaType,
//   EnumTipoCartaType,
// } from 'src/drizzle/schema/enums.schema';

export const StoragePaths = {
  // coremicro: {
  //   firmadigital: {
  //     upload: ({
  //       uid,
  //       filename,
  //       version,
  //     }: {
  //       uid: number;
  //       filename: string;
  //       version: number;
  //     }) => {
  //       return {
  //         storage_path: `coremicro/firmadigital/${uid}/${version}/${filename}`,
  //         entity_type: 'firma_digital', // Nombre de la tabla
  //         entity_id: `uid=${uid}`,
  //       };
  //     },
  //   },
  //   cartera: {
  //     cartas: {
  //       upload: ({
  //         paquete_id,
  //         tipo_carta,
  //         metodo_entrega,
  //         filename,
  //         codigo_credito,
  //         data_source,
  //       }: {
  //         paquete_id: number;
  //         tipo_carta: EnumTipoCartaType;
  //         metodo_entrega: EnumCartasMetodoEntregaType;
  //         filename: string;
  //         codigo_credito: number;
  //         data_source: string;
  //       }) => {
  //         return {
  //           storage_path: `coremicro2/cartera/cartas/data_source/${data_source}/${codigo_credito}/paquete/${paquete_id}/${tipo_carta}/${metodo_entrega}/${filename}`,
  //           entity_type: 'cartera_cartas_entrega', // Nombre de la tabla
  //           entity_id: `data_source=${data_source}&paquete=${paquete_id}&tipo_carta=${tipo_carta}&metodo_entrega=${metodo_entrega}&codigo_credito=${codigo_credito}`,
  //         };
  //       }, // Solo se puede subir una carta por entrega y tipo de carta
  //     },
  //     castigo: {
  //       consolidado: {
  //         upload: ({
  //           codigo_credito,
  //           castigo_credito_id,
  //           filename,
  //           castigo_id,
  //           data_source,
  //         }: {
  //           castigo_id: number;
  //           codigo_credito: number;
  //           castigo_credito_id: string;
  //           filename: string;
  //           data_source: string;
  //         }) => {
  //           return {
  //             storage_path: `coremicro/cartera/castigo/${castigo_id}/data_source/${data_source}/${codigo_credito}/consolidado_credito/${castigo_credito_id}/${filename}`,
  //             entity_type: 'cartera_castigo_consolidado_credito', // Nombre de la tabla
  //             entity_id: `castigo_credito_id=${castigo_credito_id}`,
  //           };
  //         },
  //       },
  //       soportes_adicionales: {
  //         upload: ({
  //           tipo_soporte,
  //           filename,
  //           codigo_credito,
  //           castigo_id,
  //           data_source,
  //         }: {
  //           tipo_soporte: EnumTipoSoportesAdicionalesType;
  //           filename: string;
  //           castigo_id: number;
  //           codigo_credito: number;
  //           data_source: string;
  //         }) => {
  //           return {
  //             storage_path: `coremicro/cartera/castigo/${castigo_id}/data_source/${data_source}/${codigo_credito}/soporter_adicionales/${tipo_soporte}/${filename}`,
  //             entity_type: 'cartera_castigo_soportes_adicionales_de_credito', // Nombre de la tabla
  //             entity_id: `tipo_soporte${tipo_soporte}`,
  //           };
  //         }, // Solo se puede subir una carta por entrega y tipo de carta
  //       },
  //       acta: {
  //         upload: ({
  //           castigo_id,
  //           filename,
  //         }: {
  //           castigo_id: number;
  //           filename: string;
  //         }) => {
  //           return {
  //             storage_path: `coremicro/cartera/castigo/${castigo_id}/${filename}`,
  //             entity_type: 'cartera_castigo_actas', // Nombre de la tabla
  //             entity_id: `castigo_id=${castigo_id}`,
  //           };
  //         }, // Solo se puede subir una carta por entrega y tipo de carta
  //       },
  //     },
  //   },
  // },
};
