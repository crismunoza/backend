"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeBase64Image = void 0;
function decodeBase64Image(base64Image) {
    // Buscar coincidencias en la cadena base64Image
    const matches = base64Image.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
    // Verificar si se encontraron coincidencias y si hay tres elementos en el arreglo matches
    if (matches && matches.length === 3) {
        // Extraer el tipo de imagen y los datos de imagen de las coincidencias
        const imageType = matches[1];
        const imageData = matches[2];
        // Crear un objeto Buffer a partir de los datos de imagen en formato base64
        const buffer = Buffer.from(imageData, "base64");
        // Devolver el objeto Buffer
        return buffer;
    }
    // Lanzar un error si el formato de imagen base64 es inválido
    throw new Error("Invalid base64 image format");
}
exports.decodeBase64Image = decodeBase64Image;
// export function decodeBase64Image(base64Image: string): Buffer {
//   // Buscar coincidencias en la cadena base64Image
//   const matches = base64Image.match(/^data:image\/(jpeg|png);base64,(.+)$/);
//   // Verificar si se encontraron coincidencias y si hay tres elementos en el arreglo matches
//   if (matches && matches.length === 3) {
//     // Extraer el tipo de imagen y los datos de imagen de las coincidencias
//     const imageType = matches[1];
//     const imageData = matches[2];
//     // Crear un objeto Buffer a partir de los datos de imagen en formato base64
//     const buffer = Buffer.from(imageData, "base64");
//     // Devolver el objeto Buffer
//     return buffer;
//   }
//   // Lanzar un error si el formato de imagen base64 es inválido
//   throw new Error("Invalid base64 image format");
// }
