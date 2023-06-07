import fs from "fs"; // Importa el módulo fs para trabajar con el sistema de archivos
import path from "path"; // Importa el módulo path para manejar rutas de archivos y directorios
import { Request, Response } from "express"; // Importa los tipos Request y Response de Express
import { Vecino, RepresentanteVecinal } from "../models/mer"; // Importa el modelo Vecino desde ../models/mer
import { decodeBase64Image } from "../utils/imageUtils"; // Importa una función utilitaria para decodificar la imagen Base64
import bcrypt from 'bcrypt';



export const verificarsiexiste = async (req: Request, res: Response) => {
  const { rut } = req.params;

  try {
      const verificarVecino = await Vecino.findOne({ where: { rut_vecino: rut } });
      const verificarRepresentante = await RepresentanteVecinal.findOne({ where: { rut_representante: rut } });

      if (verificarVecino || verificarRepresentante) {
          res.json({
              msg: `correo existe`
          });
      } else {
          res.json({
              msg: `no esta`
          });
      }
  } catch (error) {
      console.log(error);
      res.json({
          msg: `Ups ocurrió un error, comuníquese con soporte`
      });
  }
};

// Aqui empieza el metodo para insertar vecinos modulo de registro de vecinos
export const insertvecino = async (req: Request, res: Response) => {

    const {
      rut_vecino,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      direccion,
      correo_electronico,
      telefono,
      contrasenia,
      avatar,
      ruta_evidencia,
      estado,
      fk_id_junta_vecinal
    } = req.body;
  
  const hashpasword = await bcrypt.hash(contrasenia, 10);

  try {
    const imageBuffer = decodeBase64Image(ruta_evidencia);

    const imageName = `${rut_vecino}.jpg`;
    const imageFolder = path.join(__dirname, "../../src/utils/evidencia");

    if (!fs.existsSync(imageFolder)) {
      fs.mkdirSync(imageFolder, { recursive: true });
    }

    const imagePath = path.join(imageFolder, imageName);
    fs.writeFileSync(imagePath, imageBuffer);

    const imageBase64 = imageBuffer.toString('base64');

    const vecino = await Vecino.create({
      rut_vecino,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      direccion,
      correo_electronico,
      telefono,
      contrasenia: hashpasword,
      avatar,
      ruta_evidencia: imageBase64,
      estado,
      fk_id_junta_vecinal
    });

    return res.json({
      msg: 'Se insertó correctamente',
      vecino
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Error al insertar el vecino'
    });
  }
};
// Aqui termina el metodo para insertar vecinos modulo de registro de vecinos

// Aqui empezamos con el modulo de editar vecinos todos estos son los controles hacia abajo 
export const updatevecino = async (req: Request, res: Response) => {
  // Obtiene el valor del parámetro rut_vecino de la solicitud
  const { rut_vecino } = req.params;
  // Obtiene los datos del cuerpo de la solicitud
  const {
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    direccion,
    correo_electronico,
    telefono,
    contrasenia
  } = req.body;

 let hashpasword: string;
  // Busca el vecino en la base de datos
 const vecino: any = await Vecino.findOne({ where: { rut_vecino: rut_vecino } });

 if (contrasenia === vecino.contrasenia) {
   // La contraseña ya está encriptada, utiliza la misma contraseña encriptada
   hashpasword = vecino.contrasenia;
 } else {
   // La contraseña no está encriptada, encripta la contraseña
   hashpasword = await bcrypt.hash(contrasenia, 10);

 }
  // Actualiza los datos del vecino en la base de datos
  const result = await Vecino.update(
    {
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      direccion,
      correo_electronico,
      telefono,
      contrasenia: hashpasword
    },
    {
      where: {
        rut_vecino
      }
    }
  );

  if (result[0] > 0) {
    return res.json({
      msg: 'Vecino actualizado correctamente'
    });
  }

  return res.json({
    msg: 'No se encontró el vecino'
  });
}



export const getvecinos = async (req: Request, res: Response) => {
  try {
    // Obtiene todos los vecinos de la base de datos con evidencia igual a true (1)
    const listVecinos = await Vecino.findAll({
      where: {
        estado: 1
      },
    });


    return res.json({ listVecinos });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Error al obtener los vecinos'
    });
  }
};

export const deletevecino = async (req: Request, res: Response) => {
  // Obtiene el valor del parámetro rut_vecino de la solicitud
  const { rut_vecino } = req.params;
  // Elimina el vecino de la base de datos
  const deleteRowCount = await Vecino.destroy({
    where: {
      rut_vecino
    },
    cascade: true
  });

  // Eliminar la imagen asociada
  const imagePath = `src/utils/evidencia/${rut_vecino}.jpg`;
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error('Error al eliminar la imagen:', err);
      return res.status(500).json({ error: 'Error al eliminar la imagen' });
    }

    return res.json({
      msg: 'Vecino eliminado correctamente',
      count: deleteRowCount
    });
  });
};

// Aqui terminamos con el modulo de editar vecinos todos estos son los controles hacia arriba

// Aqui empezamos con el modulo de aceptar a un vecino todos estos son los controles hacia abajo
export const listarADD = async (req: Request, res: Response) => {
  try {
    // Obtiene todos los vecinos de la base de datos con evidencia igual a true (1)
    const listVecinos = await Vecino.findAll({
      where: {
        estado: 0
      },
      
    });

    console.log("listVecinos", listVecinos);

    return res.json({ listVecinos });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Error al obtener los vecinos'
    });
  }
};


export const noacepptado = async (req: Request, res: Response) => {
  // Obtiene el valor del parámetro rut_vecino de la solicitud
  const { rut_vecino } = req.params;
  // Elimina el vecino de la base de datos
  const deleteRowCount = await Vecino.destroy({
    where: {
      rut_vecino
    }
  });

  // Eliminar la imagen asociada
  const imagePath = `src/utils/evidencia/${rut_vecino}.jpg`;
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error('Error al eliminar la imagen:', err);
      return res.status(500).json({ error: 'Error al eliminar la imagen' });
    }

    return res.json({
      msg: 'Vecino eliminado correctamente',
      count: deleteRowCount
    });
  });
};

export const modificarEstado = async (req: Request, res: Response) => {
  try {
    const { rut_vecino, estado } = req.body;

    // Buscar el vecino por el rut y modificar el estado
    await Vecino.update({ estado: estado }, { where: { rut_vecino: rut_vecino } });

    return res.status(200).json({ message: 'Estado modificado correctamente' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error al modificar el estado del vecino' });
  }
};
