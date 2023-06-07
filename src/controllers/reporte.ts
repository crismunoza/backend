import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import db from '../db/connection';
import ExcelJS from 'exceljs';
import fs from 'fs';
import { Proyecto, Reporte } from '../models/mer';
import { getMaxId } from '../models/queries';

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
            "cupo_max"             NUMBER(38,0),
            "inscrito"             NVARCHAR2(255)
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
          "proyecto"."cupo_max",
          "reporte"."inscrito"
        FROM
          "reporte"
          INNER JOIN "proyecto" ON "reporte"."fk_id_proyecto" = "proyecto"."id_proyecto"
          INNER JOIN "vecino" ON "reporte"."rut_vecino" = "vecino"."rut_vecino"
          INNER JOIN "junta_vecinal" ON "proyecto"."fk_id_junta_vecinal" = "junta_vecinal"."id_junta_vecinal"';
    END;`;
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
      inscrito: 'Inscrito'
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

    const spQuery3 = `DROP TABLE "excel";`;
    await db.query(spQuery3);

    const spQuery4 = `DROP PROCEDURE "ObtenerReportePorJuntaVecinal";`;
    await db.query(spQuery4);
  } catch (error) {
    console.error('Error al obtener el reporte por junta vecinal:', error);
    res.status(500).json({ error: 'Error al obtener el reporte por junta vecinal' });
  }
};


export const verreporte = async (req: Request, res: Response) => {
  try {
    const query = `
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
        "proyecto"."cupo_max",
        "reporte"."inscrito"
      FROM
        "reporte"
        INNER JOIN "proyecto" ON "reporte"."fk_id_proyecto" = "proyecto"."id_proyecto"
        INNER JOIN "vecino" ON "reporte"."rut_vecino" = "vecino"."rut_vecino"
        INNER JOIN "junta_vecinal" ON "proyecto"."fk_id_junta_vecinal" = "junta_vecinal"."id_junta_vecinal";
    `;

    const listreportes = await db.query(query, {
      type: QueryTypes.SELECT,
    });

    console.log("listreportes", listreportes);
    console.log(JSON.stringify(listreportes));

    res.json({
      data: listreportes,
    });
  } catch (e) {
    console.log(e);
  }
};

export const inserReport = async (req:Request, res: Response) => {
  try{
    const { id_proyecto, rut, inscrito } = req.body;
    const idReporteFormmated = await getMaxId('Reporte', 'id_reporte');

    const nuevoReporte = await Reporte.create({
      id_reporte: idReporteFormmated,
      rut_vecino: rut,
      inscrito,
      fk_id_proyecto: id_proyecto
    });

    const proyecto = await Proyecto.findOne({ where: { id_proyecto: id_proyecto } });

    if (proyecto && inscrito === 'SI'){
      const cupoMaxFormmated = Number(proyecto.dataValues.cupo_max) - 1;
      await Proyecto.update(
        {cupo_max: cupoMaxFormmated},
        {where: {id_proyecto}}
      ); 
    }else{
      if (proyecto && inscrito === 'NO'){
        return res.status(200).json({ resp: 'No te has inscrito en este proyecto' });
      }else{
        return res.status(500).json({ resp: 'Error al inscribirse al proyecto', error: '0' });
      }
    }
    
    return res.status(200).json({ resp: `Inscripción realizada con éxito` });
  } catch (error) {
    console.log('error al insertar el reporte.', error)
    return res.status(500).json({ resp: 'Error al inscribirse al proyecto', error: '0' });

  }

};

export const getReport = async (req: Request, res: Response) => {
  try {
    const rutVecino = req.params.rut_vecino;
    const reports = await Reporte.findAll({ where: { rut_vecino: rutVecino } });
    return res.status(200).json(reports);
  } catch (error) {
    return res.status(500).json({ resp: "Error al obtener los reportes", error: '0' });
  }
};

export async function getVecinosInscritos(req: Request, res: Response): Promise<void> {
  const idProyecto = req.params.id_proyecto;

  try {
    const count = await Reporte.count({
      where:{
      fk_id_proyecto: idProyecto,
      inscrito: 'SI'}
    });

    res.status(200).json(count);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el recuento de vecinos inscritos' });
  }
}