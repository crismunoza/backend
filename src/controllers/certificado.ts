import { Request, Response } from 'express';
import { Comuna, JuntaVecinal, RepresentanteVecinal, Vecino } from '../models/mer';
import { covertFirstCapitalLetterWithSpace } from '../services/parser';
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

let subtitleValue = { subtitle: 'Fines generales' };
let rutNeighbor = {rut: ''};
let juntaVecinal = {nombre: ''};
let addresNeighbor = {direccion: ''};
let comunaNeighbor = {comuna: ''};
let nameRepresentanteVecinal = {nombre: ''};
let nameNeighbor = {nombre: ''};
let baseCertified = {
  tittle: '',
  header: '',
  paragraph1: '',
  paragraph2: '',
  paragraph3: '',
  goodbye: '',

}

export const getRut = async (req: Request, res: Response) => {
  try {
    const {rutVecino } = req.body;
    rutNeighbor.rut = rutVecino;
    const DataNeighbor = await Vecino.findAll({
      where: { rut_vecino: rutNeighbor.rut },
      attributes: ['primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido', 'direccion'],
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

export const getCertify = async (req: Request, res: Response) => {
  try {
    const subtitle = subtitleValue.subtitle;
    
    const doc = new PDFDocument();

    //define el nombre del archivo de salida
    const filename = 'certificadojuntavecinal.pdf';

    //establece las cabeceras para la descarga del archivo
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');

    //estilos CSS
    const styles = {
      certificado: {
        font: 'Helvetica',
        fontSize: 12,
        margin: 50,
        width: 500,
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


    doc.fontSize(styles.listItem.fontSize).text('NOMBRE: ', { continued: true }).text(nameNeighbor.nombre);
    doc.fontSize(styles.listItem.fontSize).text('RUT: ', { continued: true }).text(rutNeighbor.rut);
    doc.fontSize(styles.listItem.fontSize).text('DIRECCIÓN: ', { continued: true }).text(addresNeighbor.direccion);
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
    
    //envía el contenido del documento PDF como respuesta al cliente.
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ resp: "Error al descargar el certificado", error: '0' });
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

