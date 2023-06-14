import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Vecino, RepresentanteVecinal } from "../models/mer";
const nodemailer = require('nodemailer');

// Configurar el transporte
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'juntaaunclick@gmail.com',
    pass: 'mepwksjzhmnwmtpq'
  }
});
//metodo para cambiar contraseña

export const cambiarContrasena = async (req: Request, res: Response) => {
  const { rut, correo_electronico } = req.body;

  try {
    const verificarVecino = await Vecino.findOne({ where: { rut_vecino: rut, correo_electronico } });
    const verificarRepresentante = await RepresentanteVecinal.findOne({ where: { rut_representante: rut, correo_electronico } });

    if (verificarVecino) {
      const nuevaContrasenia = generarContrasenaAleatoria(8); // Genera una contraseña aleatoria
      const hashPassword = await bcrypt.hash(nuevaContrasenia, 10);
      await verificarVecino.update({ contrasenia: hashPassword });
      console.log("CONTRANUEVA", nuevaContrasenia);
      const contenidoCorreo = `<body>
            <h1>¡Restablecimiento de Contraseña!</h1>
            <p>Has solicitado restablecer tu contraseña.</p>
            <p>Recuerda que siempre podrás cambiar tu contraseña una vez ingreses al sistema. Para ello, dirígete a tu perfil, haz clic en "Configuración de Perfil" y encontrarás la sección de "Clave".</p>
            <p>En el apartado de "Clave Actual", ingresa la contraseña proporcionada en este correo y luego ingresa la "Nueva Clave" de tu elección.</p>
            <p style="color: rgb(199, 0, 57);"><h3>**Nueva Contraseña**</h3></p>
            <p>Esta es tu nueva contraseña: ${nuevaContrasenia}</p>
            <p>Ahora puedes ingresar a nuestro sitio.</p>
            <p><a href="http://localhost:4200/login">Ir al sitio</a></p>
            </body>                       
            `;
      await enviarCorreo(correo_electronico, 'Restablecimiento de Contraseña', contenidoCorreo); //se debe descomentar para usar el envio de correo

      res.json({
        msg: 'ok'
      });
    } else if (verificarRepresentante) {
      const nuevaContrasenia = generarContrasenaAleatoria(8); // Genera una contraseña aleatoria
      const hashPassword = await bcrypt.hash(nuevaContrasenia, 10);
      await verificarRepresentante.update({ contrasenia: hashPassword });
      console.log("CONTRANUEVA", nuevaContrasenia);
      const contenidoCorreo = `<body>
            <h1>¡Restablecimiento de Contraseña!</h1>
            <p>Has solicitado restablecer tu contraseña.</p>
            <p>Recuerda que siempre podrás cambiar tu contraseña una vez ingreses al sistema. Para ello, dirígete a tu perfil, haz clic en "Configuración de Perfil" y encontrarás la sección de "Clave".</p>
            <p>En el apartado de "Clave Actual", ingresa la contraseña proporcionada en este correo y luego ingresa la "Nueva Clave" de tu elección.</p>
            <p style="color: rgb(199, 0, 57);"><h3>**Nueva Contraseña**</h3></p>
            <p>Esta es tu nueva contraseña: ${nuevaContrasenia}</p>
            <p>Ahora puedes ingresar a nuestro sitio.</p>
            <p><a href="http://localhost:4200/login">Ir al sitio</a></p>
          </body>                         
            `;
      await enviarCorreo(correo_electronico, 'Restablecimiento de Contraseña', contenidoCorreo); //se debe descomentar para usar el envio de correo

      res.json({
        msg: 'ok'
      });
    } else {
      // Verificar si el rut existe en la base de datos
      const verificarSoloRutVecino = await Vecino.findOne({ where: { rut_vecino: rut } });
      const verificarSoloRutRepresentante = await RepresentanteVecinal.findOne({ where: { rut_representante: rut } });
      if (verificarSoloRutVecino) {
        res.json({
          msg: 'okrut',
          error: 'correo_incorrecto'
        });
      } else if (verificarSoloRutRepresentante) {
        res.json({
          msg: 'okrut',
          error: 'correo_incorrecto'
        });
      } else {
        res.json({
          msg: 'okrut',
          error: 'rut_inexistente'
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      msg: 'Ups ocurrió un error, comuníquese con soporte'
    });
  }
};

const generarContrasenaAleatoria = (longitud: number) => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let contrasena = '';

  for (let i = 0; i < longitud; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    contrasena += caracteres.charAt(indice);
  }

  return contrasena;
};

// Función para enviar correo electrónico
const enviarCorreo = async (destinatario: string, asunto: string, contenido: string) => {
  try {
    const mailOptions = {
      from: 'juntaaunclick@gmail.com',
      to: destinatario,
      subject: asunto,
      html: contenido
    };

    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a ${destinatario}`);
  } catch (error) {
    console.log('Error al enviar el correo:', error);
  }
};

