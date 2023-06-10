import { Request, Response } from 'express';
import { Comuna, JuntaVecinal, RepresentanteVecinal, Vecino, Certificado } from '../models/mer';
import { convertUpperCASE, covertFirstCapitalLetterWithSpace, removeAccents } from '../services/parser';
import { getMaxId } from '../models/queries';
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');
//necesario para utilizar la key de sendgrid almacenada en .env
// Configurar el transporte
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'juntaaunclick@gmail.com',
    pass: 'mepwksjzhmnwmtpq'
  }
});
// Configurar el email
let subtitleValue = { subtitle: 'Fines generales' };
let rutNeighbor = {rut: ''};
let juntaVecinal = {nombre: ''};
let addresNeighbor = {direccion: ''};
let comunaNeighbor = {comuna: ''};
let nameRepresentanteVecinal = {nombre: ''};
let nameNeighbor = {nombre: ''};
let emailNeighbor = {email: ''};
let id_neighbor = {id_key: ''};
let baseCertified = {
  tittle: '',
  header: '',
  paragraph1: '',
  paragraph2: '',
  paragraph3: '',
  goodbye: '',

}

export const getDataNeighbor = async (req: Request, res: Response) => {
  try {
    const {rutVecino } = req.body;
    rutNeighbor.rut = rutVecino;
    const DataNeighbor = await Vecino.findAll({
      where: { rut_vecino: rutNeighbor.rut },
      attributes: ['id_vecino', 'primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido', 'direccion', 'correo_electronico'],
      include: [
        {
          model: JuntaVecinal,
          attributes: ['razon_social'],
          include: [
            {
              model: RepresentanteVecinal,
              attributes: ['primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido'],
            },
            {
              model: Comuna,
              attributes: ['nombre'],
            },
          ],
        },
      ],
    });
    juntaVecinal.nombre = covertFirstCapitalLetterWithSpace(DataNeighbor[0].dataValues.JuntaVecinal.razon_social);
    addresNeighbor.direccion = covertFirstCapitalLetterWithSpace(DataNeighbor[0].dataValues.direccion);
    comunaNeighbor.comuna = DataNeighbor[0].dataValues.JuntaVecinal.comuna.nombre;

    nameRepresentanteVecinal.nombre = DataNeighbor[0].dataValues.JuntaVecinal.RepresentanteVecinals[0].dataValues.primer_nombre + ' ' + DataNeighbor[0].dataValues.JuntaVecinal.RepresentanteVecinals[0].dataValues.primer_apellido + ' ' + DataNeighbor[0].dataValues.JuntaVecinal.RepresentanteVecinals[0].dataValues.segundo_apellido;
    nameRepresentanteVecinal.nombre = covertFirstCapitalLetterWithSpace(nameRepresentanteVecinal.nombre);
    
    nameNeighbor.nombre = DataNeighbor[0].dataValues.primer_nombre + ' ' + DataNeighbor[0].dataValues.segundo_nombre + ' ' + DataNeighbor[0].dataValues.primer_apellido + ' ' + DataNeighbor[0].dataValues.segundo_apellido;
    nameNeighbor.nombre = covertFirstCapitalLetterWithSpace(nameNeighbor.nombre);

    emailNeighbor.email = DataNeighbor[0].dataValues.correo_electronico;
    id_neighbor.id_key = DataNeighbor[0].dataValues.id_vecino;

    baseCertified.tittle = 'Certificado de Domicilio',
    baseCertified.header = `La ${juntaVecinal.nombre}, por medio de la presente certifica que:`,
    baseCertified.paragraph1 = `Es residente en la localidad de ${addresNeighbor.direccion}, comuna de ${comunaNeighbor.comuna}, Región Metropolitana de Santiago, Chile. El solicitante ha sido reconocido como vecino(a) activo(a) y participante en nuestra comunidad.`,
    baseCertified.paragraph2 = 'Este certificado se emite a solicitud del interesado(a) para los fines que estime conveniente.',
    baseCertified.paragraph3 = 'Sin otro particular, se extiende el presente certificado a petición del interesado(a) y a los efectos legales y administrativos que correspondan.',
    baseCertified.goodbye = 'Atentamente.'
    
    return res.status(200).json("Rut obtenido con éxito.")
  } catch (error) {
    console.log(error);
    return res.status(400).json({resp: "Error al obtener el rut del usuario", error: '0'})
  }
};

export const updateSubtitle = (req: Request, res: Response) => {
  
  const { subtitle } = req.body;
  subtitleValue.subtitle = subtitle;
  res.json({ subtitle });
};
//**generación del certificado */
async function generateCertificate (): Promise<Buffer>{
  const subtitle = subtitleValue.subtitle;
    
  const doc = new PDFDocument();

  //estilos CSS
  const styles = {
    certificado: {
      font: 'Helvetica',
      fontSize: 12,
      margin: 50,
      width: 600,
      padding: 50,
      border: '10px solid #000',
    },
    cardSubTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      margin: [0, 20, 0, 40],
      alignment: 'center',
      color: '#888888',
    },
    subTitle: {
      fontSize: 20,
      margin: [0, 30, 0, 0],
      alignment: 'center',
    },
    cardText: {
      fontSize: 16,
      margin: [0, 30, 0, 0],
      alignment: 'justify',
    },
    listItem: {
      fontSize: 16,
    },
    paragraph: {
      fontSize: 16,
      margin: [0, 30, 0, 0],
      alignment: 'justify',
    },
    strong: {
      fontSize: 18,
      margin: [0, 20, 0, 0],
    },
  };
  //se obtiene la altura para separar los títulos.
  const titleHeight = doc.currentLineHeight();
  // Aplica los estilos al contenido del certificado
  doc.font(styles.certificado.font);

  /**Certificado**/
  //border.
  doc.rect(50, 50, 500, 700).stroke(styles.certificado.border);
  //establece el color gris.
  doc.fillColor('#555555');

  doc.fontSize(styles.cardSubTitle.fontSize).text(baseCertified.tittle, {
    ...styles.cardSubTitle, align: 'center',});
  doc.y += titleHeight + 10;

  doc.fillColor('#888888');

  doc.fontSize(styles.subTitle.fontSize).text(subtitle, {...styles.subTitle, align: 'center',} );
  doc.y += titleHeight + 10;

  doc.fillColor('black');

  //contenido
  doc.fontSize(styles.cardText.fontSize).text(baseCertified.header, {...styles.cardText, align: 'justify',});
  doc.y += titleHeight + 10;
  
  doc.fillColor('#555555');

  
  doc.fontSize(styles.listItem.fontSize).text('NOMBRE: '.padEnd(15), { continued: true }).text(nameNeighbor.nombre);
  doc.fontSize(styles.listItem.fontSize).text('RUT: '.padEnd(21), { continued: true }).text(rutNeighbor.rut);
  doc.fontSize(styles.listItem.fontSize).text('DIRECCIÓN: '.padEnd(14), { continued: true }).text(addresNeighbor.direccion);
  doc.y += titleHeight + 10;
  
  doc.fillColor('black');

  doc.fontSize(styles.paragraph.fontSize).text(baseCertified.paragraph1, {...styles.paragraph, align: 'justify',});
  doc.y += titleHeight + 10;

  doc.fontSize(styles.paragraph.fontSize).text(baseCertified.paragraph2, {...styles.paragraph, align: 'justify',});
  doc.y += titleHeight + 10;

  doc.fontSize(styles.paragraph.fontSize).text(baseCertified.paragraph3, {...styles.paragraph, align: 'justify',});
  doc.y += titleHeight + 8;

  doc.fontSize(styles.paragraph.fontSize).text(baseCertified.goodbye, styles.paragraph);
  doc.y += titleHeight + 5;

  doc.fillColor('#555555');

  doc.fontSize(styles.paragraph.fontSize).text(nameRepresentanteVecinal.nombre, {...styles.paragraph, align: 'center',});

  doc.y += titleHeight + 2;

  doc.fontSize(styles.paragraph.fontSize).text(juntaVecinal.nombre,{...styles.paragraph, align: 'center',} );

  doc.y += titleHeight + 2;

  doc.fontSize(styles.paragraph.fontSize).text(`Fecha: ${new Date().toLocaleDateString()}`,{...styles.paragraph, align: 'center'});

  //generación código QR.
  const qrOptions = {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    margin: 2,
    width: 80,
    color: {
    dark: '#000000', 
    light: '#ffffff', 
    },
  };
  
  const qrImage = await QRCode.toDataURL('https://drive.google.com/drive/folders/1BjoiNwJ95USuzlnHjWCxGB8Dte-IIbHR', qrOptions);

  //centrar código QR.
  const qrImageWidth = 60;
  const qrImageHeight = 60;
  const qrImageX = (doc.page.width - qrImageWidth) / 2;
  const qrImageY = doc.y + titleHeight + 15;

  doc.rect(qrImageX - 5, qrImageY - 5, qrImageWidth + 10, qrImageHeight + 10).stroke('#000000'); 

  doc.image(qrImage, qrImageX, qrImageY, { width: qrImageWidth, height: qrImageHeight });

  const buffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.end();
  });

  return buffer;

};

export const getCertify = async (req: Request, res: Response) => {
  try {
    const buffer = await generateCertificate();
    res.setHeader('Content-Type', 'application/pdf');
    res.send(buffer);
    
    const maxId = await getMaxId('Certificado','id_certificado');
    
    const subtitleFormatted = removeAccents(subtitleValue.subtitle)
    
    const certificado = await Certificado.create({
      id_certificado: maxId,
      descripcion: subtitleFormatted,
      fk_id_vecino: id_neighbor.id_key
    });
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({ resp: "Error al descargar el certificado", error: '1' });
  }
};

export const getParagraph = async (req: Request, res: Response) =>{

  try {
    let certified = {
      title: baseCertified.tittle,
      header: baseCertified.header,
      paragraph1: baseCertified.paragraph1,
      paragraph2: baseCertified.paragraph2,
      paragraph3: baseCertified.paragraph3,
      goodbye: baseCertified.goodbye,
      representante: nameRepresentanteVecinal.nombre,
      juntaV: juntaVecinal.nombre,
      nombreVecino: nameNeighbor.nombre,
      direccionVecino: addresNeighbor.direccion,
      rutVecino: rutNeighbor.rut 
    }
    return res.status(200).json({ certified });
  } catch {
    return res.status(400).json({ resp: "Error al obtener la información del certificado", error: '0' });
  }
};

export const Enviocerti = async (req: Request, res: Response) => {
  try {
    const certFile = await generateCertificate();
    
    const mailOptions = {
      from: 'juntaaunclick@gmail.com',
      to: emailNeighbor.email,
      subject: 'Certificado De Domicilio',
      html: `
        <p>Estimado/a: </p>
        <strong>${nameNeighbor.nombre}</strong>
        <p>Adjunto encontrarás el certificado de domicilio emitido por${juntaVecinal.nombre}.</p>
        <p>Atentamente.</p>
        <strong>${nameRepresentanteVecinal.nombre}</strong><br>
        <strong>Representante ${juntaVecinal.nombre}</strong>
      `,
      attachments: [
        {
          filename: 'certificadothis.juntaVecinal.pdf',
          content: certFile,
        },
      ],
    };

    // Envío del correo electrónico con el certificado adjunto
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ resp: `Certificado enviado con éxito al destinatario: ${emailNeighbor.email}` });
  } catch (error) {
    console.error('Error al enviar el correo electrónico', error);
    return res.status(500).json({ resp: 'Error al enviar el certificado', error: '0' });
  }
};


