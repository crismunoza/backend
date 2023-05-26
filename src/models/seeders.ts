import { Comuna } from "./mer";


export class Seeders{

    //**datos a insertar */
    dataComuna = [
        { nombre: '-------' },
        { nombre: 'Puente Alto' },
        { nombre: 'La Florida' },
        { nombre: 'Maipu' },
        { nombre: 'San Ramon' },
        { nombre: 'Macul' },
    ];

    //**promise que inserta los datos de inicio en las tablas comunas y municipalidad. */
    insertSeeders = async () => {
    try {
      // Verificar si la tabla Comuna contiene datos.
      const comunaCount = await Comuna.count();

      if (comunaCount > 0) {
        console.log(`La tabla Comuna ya contiene ${comunaCount} registros.`);
      } else {
        // Insertar datos en la tabla Comuna.
        await Comuna.bulkCreate(this.dataComuna);
        console.log('Se han insertado los datos correctamente en la tabla Comuna.');
      }

    } catch (error) {
      console.error('Error al insertar los datos:', error);
    }
  };
}
