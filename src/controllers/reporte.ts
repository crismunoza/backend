import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import db from '../db/connection';
import ExcelJS from 'exceljs';
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
    // const query = `SELECT * FROM "excel" WHERE "numero_junta_vecinal" = :id_junta_vecinal`;
const query = `
  SELECT
    "excel"."numero_junta_vecinal" AS "Junta Vecinal",
    "excel"."rut_junta_vecinal" AS "Rut Junta Vecinal",
    "excel"."razon_social" AS "Nombre Junta Vecinal",
    "excel"."rut_vecino" AS "Rut Vecino",
    "excel"."primer_nombre" AS "Nombre Vecino",
    "excel"."segundo_nombre" AS "Segundo Nombre",
    "excel"."primer_apellido" AS "Primer Apellido",
    "excel"."segundo_apellido" AS "Segundo Apellido",
    "excel"."direccion" AS "Dirección Vecino",
    "excel"."inscrito" AS "Inscrito",
    "proyecto"."nombre" AS "Nombre Proyecto",
    "proyecto"."descripcion" AS "Descripción Proyecto",
    "proyecto"."estado" AS "Estado Proyecto",
    "proyecto"."fecha_proyecto" AS "Fecha Proyecto",
    "proyecto"."cupo_min" AS "Cupo Mínimo",
    "proyecto"."cupo_max" AS "Cupo Máximo",
    COUNT(CASE WHEN "excel"."inscrito" = 'SI' THEN 1 END) AS "Inscritos",
    COUNT(CASE WHEN "excel"."inscrito" = 'NO' THEN 1 END) AS "No Inscritos",
    SUM(CASE WHEN "excel"."inscrito" IN ('SI', 'NO') THEN 1 ELSE 0 END) AS "Total"
  FROM
    "excel"
    INNER JOIN "proyecto" ON "excel"."nombre_proyecto" = "proyecto"."nombre"
  WHERE
    "excel"."numero_junta_vecinal" = :id_junta_vecinal
  GROUP BY
    "excel"."numero_junta_vecinal",
    "excel"."rut_junta_vecinal",
    "excel"."razon_social",
    "excel"."rut_vecino",
    "excel"."primer_nombre",
    "excel"."segundo_nombre",
    "excel"."primer_apellido",
    "excel"."segundo_apellido",
    "excel"."direccion",
    "excel"."inscrito",
    "proyecto"."nombre",
    "proyecto"."descripcion",
    "proyecto"."estado",
    "proyecto"."fecha_proyecto",
    "proyecto"."cupo_min",
    "proyecto"."cupo_max"
`;

const results: { [key: string]: any }[] = await db.query(query, {
  replacements: { id_junta_vecinal },
  type: QueryTypes.SELECT,
});

// Generar el archivo Excel en memoria
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Reporte');

// Agregar los datos del proyecto a las celdas
worksheet.getCell('A1').value = 'Junta Vecinal';
worksheet.getCell('A1').style = {
  font: {
    bold: true
  }
};
worksheet.getCell('A2').value = results[0]['Junta Vecinal'];

worksheet.getCell('B1').value = 'Rut Junta Vecinal';
worksheet.getCell('B1').style = {
  font: {
    bold: true
  }
};
worksheet.getCell('B2').value = results[0]['Rut Junta Vecinal'];

worksheet.getCell('C1').value = 'Nombre Junta Vecinal';
worksheet.getCell('C1').style = {
  font: {
    bold: true
  }
};
worksheet.getCell('C2').value = results[0]['Nombre Junta Vecinal'];

worksheet.getCell('A4').value = 'Nombre Proyecto';
worksheet.getCell('A4').style = {
  font: {
    bold: true
  }
};
worksheet.getCell('A5').value = results[0]['Nombre Proyecto'];

worksheet.getCell('B4').value = 'Descripción';
worksheet.getCell('B4').style = {
  font: {
    bold: true
  }
};
worksheet.getCell('B5').value = results[0]['Descripción Proyecto'];

worksheet.getCell('C4').value = 'Cupo Mínimo';
worksheet.getCell('C4').style = {
  font: {
    bold: true
  }
};
worksheet.getCell('C5').value = results[0]['Cupo Mínimo'];
worksheet.getCell('C5').style = {
  alignment: {
    horizontal: 'center'
  }
};

worksheet.getCell('D4').value = 'Cupo Máximo';
worksheet.getCell('D4').style = {
  font: {
    bold: true
  }
};
worksheet.getCell('D5').value = results[0]['Cupo Máximo'];
worksheet.getCell('D5').style = {
  alignment: {
    horizontal: 'center'
  }
};
worksheet.getCell('E4').value = 'No Inscritos';
worksheet.getCell('E4').style = {
  font: {
    bold: true
  }
};
worksheet.getCell('E5').value = results[0]['No Inscritos'];
worksheet.getCell('E5').style = {
  alignment: {
    horizontal: 'center'
  }
};

worksheet.getCell('F4').value = 'Si Inscritos';
worksheet.getCell('F4').style = {
  font: {
    bold: true
  }
};
worksheet.getCell('F5').value = results[0]['Inscritos'];
worksheet.getCell('F5').style = {
  alignment: {
    horizontal: 'center'
  }
};

worksheet.getCell('G4').value = 'Total Inscritos';
worksheet.getCell('G4').style = {
  font: {
    bold: true
  }
};
worksheet.getCell('G5').value = results[0]['Total'];
worksheet.getCell('G5').style = {
  alignment: {
    horizontal: 'center'
  }
};
worksheet.getCell('H4').value = 'Estado';
worksheet.getCell('H4').style = {
  font: {
    bold: true
  }
};
worksheet.getCell('H5').value = results[0]['Estado Proyecto'];

worksheet.getCell('I4').value = 'Fecha Proyecto';
worksheet.getCell('I4').style = {
  font: {
    bold: true
  }
};
worksheet.getCell('I5').value = results[0]['Fecha Proyecto'];

// Encabezados de los vecinos
worksheet.getCell('A7').value = 'Rut Vecino';
worksheet.getCell('A7').style = {
  font: {
    bold: true
  }
};
worksheet.getCell('B7').value = 'Nombre Vecino';
worksheet.getCell('B7').style = {
  font: {
    bold: true
  }
};
worksheet.getCell('C7').value = 'Segundo Nombre';
worksheet.getCell('C7').style = {
  font: {
    bold: true
  }
};
worksheet.getCell('D7').value = 'Primer Apellido';
worksheet.getCell('D7').style = {
  font: {
    bold: true
  }
};
worksheet.getCell('E7').value = 'Segundo Apellido';
worksheet.getCell('E7').style = {
  font: {
    bold: true
  }
};
worksheet.getCell('F7').value = 'Dirección Vecino';
worksheet.getCell('F7').style = {
  font: {
    bold: true
  }
};
worksheet.getCell('G7').value = 'Inscrito';
worksheet.getCell('G7').style = {
  font: {
    bold: true
  }
};

// Datos de los vecinos
results.forEach((row, index) => {
  const rowNumber = index + 8;
  worksheet.getCell(`A${rowNumber}`).value = row['Rut Vecino'];
  worksheet.getCell(`B${rowNumber}`).value = row['Nombre Vecino'];
  worksheet.getCell(`C${rowNumber}`).value = row['Segundo Nombre'];
  worksheet.getCell(`D${rowNumber}`).value = row['Primer Apellido'];
  worksheet.getCell(`E${rowNumber}`).value = row['Segundo Apellido'];
  worksheet.getCell(`F${rowNumber}`).value = row['Dirección Vecino'];
  worksheet.getCell(`G${rowNumber}`).value = row['Inscrito'];
  worksheet.getCell(`G${rowNumber}`).style = {
    alignment: {
      horizontal: 'center'
    }
  };
});

worksheet.columns.forEach((column) => {
  column.width = 20;
});

// Generar el archivo Excel en memoria
const buffer = await workbook.xlsx.writeBuffer();

// Especificar el nombre del archivo Excel
const fileName = `REPORTE.xlsx`;

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

export const inserReport = async (req: Request, res: Response) => {
  try {
    const { id_proyecto, rut, inscrito } = req.body;
    const idReporteFormmated = await getMaxId('Reporte', 'id_reporte');
    const nuevoReporte = await Reporte.create({
      id_reporte: idReporteFormmated,
      rut_vecino: rut,
      inscrito,
      fk_id_proyecto: id_proyecto
    });
    const proyecto = await Proyecto.findOne({ where: { id_proyecto: id_proyecto } });
    if (proyecto && inscrito === 'SI') {
      const cupoMaxFormmated = Number(proyecto.dataValues.cupo_max) - 1;
      await Proyecto.update(
        { cupo_max: cupoMaxFormmated },
        { where: { id_proyecto } }
      );
    } else {
      if (proyecto && inscrito === 'NO') {
        return res.status(200).json({ resp: 'No te has inscrito en este proyecto' });
      } else {
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
      where: {
        fk_id_proyecto: idProyecto,
        inscrito: 'SI'
      }
    });
    res.status(200).json(count);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el recuento de vecinos inscritos' });
  }
}