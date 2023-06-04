import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import db from '../db/connection';
import ExcelJS from 'exceljs';
import fs from 'fs';

// Ruta para obtener el reporte por junta vecinal
export const CrearReport = async (req: Request, res: Response) => {
  const { id_junta_vecinal } = req.params;

  try {

    const spQuery1 = `CREATE OR REPLACE PROCEDURE "ObtenerReportePorJuntaVecinal" AS
    BEGIN
      -- Crear la tabla si no existe
    BEGIN
        EXECUTE IMMEDIATE 'CREATE TABLE "excel" (
          "numero_junta_vecinal" NUMBER(38,0),
          "rut_junta_vecinal"    NVARCHAR2(255),
          "razon_social"         NVARCHAR2(255),
          "rut_vecino"           NVARCHAR2(255),
          "primer_nombre"        NVARCHAR2(255),
          "segundo_nombre"       NVARCHAR2(255),
          "primer_apellido"      NVARCHAR2(255),
          "segundo_apellido"     NVARCHAR2(255),
          "direccion"            NVARCHAR2(255),
          "nombre_proyecto"      NVARCHAR2(255),
          "descripcion_proyecto" NVARCHAR2(255),
          "estado_proyecto"      NVARCHAR2(255),
          "fecha_proyecto"       NVARCHAR2(255),
          "cupo_min"             NUMBER(38,0),
          "cupo_max"             NUMBER(38,0)
        )';
      EXCEPTION
        WHEN OTHERS THEN
          -- Manejar la excepción si la tabla ya existe
          IF SQLCODE != -955 THEN
            RAISE;
          END IF;
      END;
    
      -- Truncar la tabla antes de insertar los datos
      EXECUTE IMMEDIATE 'TRUNCATE TABLE "excel"';
    
      -- Insertar todos los datos en la tabla
      EXECUTE IMMEDIATE 'INSERT INTO "excel"
      SELECT
        "junta_vecinal"."id_junta_vecinal",
        "junta_vecinal"."rut_junta",
        "junta_vecinal"."razon_social",
        "vecino"."rut_vecino",
        "vecino"."primer_nombre",
        "vecino"."segundo_nombre",
        "vecino"."primer_apellido",
        "vecino"."segundo_apellido",
        "vecino"."direccion",
        "proyecto"."nombre",
        "proyecto"."descripcion",
        "proyecto"."estado",
        "proyecto"."fecha_proyecto",
        "proyecto"."cupo_min",
        "proyecto"."cupo_max"
      FROM
        "reporte"
        INNER JOIN "proyecto" ON "reporte"."fk_id_proyecto" = "proyecto"."id_proyecto"
        INNER JOIN "vecino" ON "reporte"."rut_vecino" = "vecino"."rut_vecino"
        INNER JOIN "junta_vecinal" ON "proyecto"."fk_id_junta_vecinal" = "junta_vecinal"."id_junta_vecinal"';
    END; `;
    await db.query(spQuery1);
    // Ejecutar el SP para llenar la tabla
    const spQuery = `BEGIN "ObtenerReportePorJuntaVecinal"; END;`;
    await db.query(spQuery);

    // Consultar la tabla para obtener los datos actualizados
    const query = `SELECT * FROM "excel" WHERE "numero_junta_vecinal" = :id_junta_vecinal`;
    const results = await db.query(query, {
      replacements: { id_junta_vecinal },
      type: QueryTypes.SELECT,
    });

    // Generar el archivo Excel en memoria
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    // Definir los nombres personalizados de las columnas
    const columnHeaders: { [key: string]: string } = {
      numero_junta_vecinal: 'Junta Vecinal',
      rut_junta_vecinal: 'Rut Junta Vecinal',
      razon_social: 'Nombre Junta Vecinal',
      rut_vecino: 'Rut Vecino',
      primer_nombre: 'Nombre Vecino',
      segundo_nombre: 'Segundo Nombre',
      primer_apellido: 'Primer Apellido',
      segundo_apellido: 'Segundo Apellido',
      direccion: 'Dirección Vecino',
      nombre_proyecto: 'Nombre Proyecto',
      descripcion_proyecto: 'Descripción Proyecto',
      estado_proyecto: 'Estado Proyecto',
      fecha_proyecto: 'Fecha Proyecto',
      cupo_min: 'Cupo Mínimo',
      cupo_max: ' Cupo Máximo',
    };

    // Agregar los encabezados de columna personalizados al archivo Excel
    const headers = Object.keys(results[0]);
    headers.forEach((header, index) => {
      const column = worksheet.getColumn(index + 1);
      const columnHeader = columnHeaders[header];
      column.header = columnHeader;
      column.width = 20;
    });

    // Agregar los datos al archivo Excel
    results.forEach((row) => {
      const values = Object.values(row);
      worksheet.addRow(values);
    });

    // Generar el archivo Excel en memoria
    const buffer = await workbook.xlsx.writeBuffer();

    // Especificar el nombre del archivo Excel
    const fileName = 'reporte.xlsx';

    // Enviar el archivo Excel como respuesta para descargarlo en el navegador
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(buffer);

  } catch (error) {
    console.error('Error al obtener el reporte por junta vecinal:', error);
    res.status(500).json({ error: 'Error al obtener el reporte por junta vecinal' });
  }
};


