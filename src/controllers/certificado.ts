import { Request, Response } from 'express';
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

let subtitleValue = { subtitle: 'Fines generales' };

let certified = {
  title: 'Certificado de Domicilio',
  header: 'La Junta Vecinal Villa Puente Alto, por medio de la presente, certifica que:',
  paragraph1: 'Es residente en la localidad de Villa Puente Alto, comuna de Puente Alto, Región Metropolitana de Santiago, Chile. El solicitante ha sido reconocido como vecino(a) activo(a) y participante en nuestra comunidad.',
  paragraph2: 'Este certificado se emite a solicitud del interesado(a) para los fines que estime conveniente.',
  paragraph3: 'Sin otro particular, se extiende el presente certificado a petición del interesado(a) y a los efectos legales y administrativos que correspondan.',
  goodbye: 'Atentamente.'
  
};

export const updateSubtitle = (req: Request, res: Response) => {
  
  const { subtitle } = req.body;
  subtitleValue.subtitle = subtitle;

  res.json({ subtitle });
};

export const getCertify = async (req: Request, res: Response) => {

  const subtitle  = subtitleValue.subtitle;
  //crea un nuevo documento PDF
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

  doc.fontSize(styles.cardSubTitle.fontSize).text(certified.title, {
    ...styles.cardSubTitle, align: 'center',});
  doc.y += titleHeight + 10;

  doc.fillColor('#888888');

  doc.fontSize(styles.subTitle.fontSize).text(subtitle, {...styles.subTitle, align: 'center',} );
  doc.y += titleHeight + 10;

  doc.fillColor('black');

  //contenido
  doc.fontSize(styles.cardText.fontSize).text(certified.header, {...styles.cardText, align: 'justify',});
  doc.y += titleHeight + 10;
  
  doc.fillColor('#555555');

  const nombre = 'John Doe';
  const rut = '123456789';
  const direccion = 'Calle Principal 123';

  doc.fontSize(styles.listItem.fontSize).text('NOMBRE:', { continued: true }).text(nombre);
  doc.fontSize(styles.listItem.fontSize).text('RUT:', { continued: true }).text(rut);
  doc.fontSize(styles.listItem.fontSize).text('DIRECCIÓN:', { continued: true }).text(direccion);
  doc.y += titleHeight + 10;
  
  doc.fillColor('black');

  doc.fontSize(styles.paragraph.fontSize).text(certified.paragraph1, {...styles.paragraph, align: 'justify',});
  doc.y += titleHeight + 10;

  doc.fontSize(styles.paragraph.fontSize).text(certified.paragraph2, {...styles.paragraph, align: 'justify',});
  doc.y += titleHeight + 10;

  doc.fontSize(styles.paragraph.fontSize).text(certified.paragraph3, {...styles.paragraph, align: 'justify',});
  doc.y += titleHeight + 8;

  doc.fontSize(styles.paragraph.fontSize).text(certified.goodbye, styles.paragraph);
  doc.y += titleHeight + 5;

  doc.fillColor('#555555');

  doc.fontSize(styles.paragraph.fontSize).text('[Nombre del representante de la Junta Vecinal]', {...styles.paragraph, align: 'center',});

  doc.y += titleHeight + 2;

  doc.fontSize(styles.paragraph.fontSize).text('Junta Vecinal Villa Puente Alto',{...styles.paragraph, align: 'center',} );

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
};

export const getParagraph = async (req: Request, res: Response) =>{

  try {
    return res.status(200).json({ certified });
  } catch {
    return res.status(400).json({ resp: "Error al obtener la información del certificado", error: '0' });
  }
};

