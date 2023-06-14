/**
 * Cambio del formato de la fecha.
 * @param fecha 
 * @returns fecha.
 */
export const formatDate = (fecha: string): string => {
  const dateOriginal = new Date(fecha);
  const day = dateOriginal.getDate().toString().padStart(2, '0');
  const month = (dateOriginal.getMonth() + 1).toString().padStart(2, '0');
  const year = dateOriginal.getFullYear().toString();
  return `${day}-${month}-${year}`;
};
/**
 * Cambio de la primera letra a mayúscula.
 * @param word 
 * @returns word
 */
export const parserUpperWord = (word: string): string => {
  //obtención de la primera letra.
  const firstLetter = word.charAt(0).toUpperCase();
  //inserción del resto de la palabra. 
  const restOfWord = word.slice(1); 
  
  return `${firstLetter}${restOfWord}`;  
}

export const convertUpperCASE = (palabra: string) => {
  return palabra.toUpperCase();
};

export const deleteSpace = (phrase: string) => {
  const words = phrase.split(' ').filter(word => word !== '');
  return words.join('');
};

export const covertFirstCapitalLetterWithSpace = (cadena: string) => {
  const palabras = cadena.toLowerCase().split(' ');

  const resultado = palabras.map((palabra) => {
    if (palabra.length === 0) {
      return '';
    }

    const primeraLetra = palabra.charAt(0).toUpperCase();
    const restoPalabra = palabra.slice(1);

    return primeraLetra + restoPalabra;
  });

  return resultado.join(' ');
};
/**
 * eliminación de la tilde en alguna vocal.
 * @param letter 
 * @returns letter
 */
export const removeAccents = (letter: string) => {
  const accents = [
    { from: 'á', to: 'a' },
    { from: 'é', to: 'e' },
    { from: 'í', to: 'i' },
    { from: 'ó', to: 'o' },
    { from: 'ú', to: 'u' },
  ];

  for (const accent of accents) {
    if (letter.includes(accent.from)) {
      letter = letter.replace(accent.from, accent.to);
    }
  }

  return letter;
};

export const convertToLowerCase = (words: string) => {
  return words.toLowerCase();
}  