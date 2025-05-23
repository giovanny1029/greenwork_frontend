export const decodeUtf8Text = (text: string | undefined | null): string => {
  if (!text) return '';
  
  try {
    // Primera prueba: decodificar directamente
    const decoded = decodeURIComponent(escape(text));
    if (decoded.includes('Ã')) {
      // Si aún vemos caracteres Ã, intentamos decodificar dos veces
      // (esto pasa cuando el texto ha sido codificado dos veces)
      return decodeURIComponent(escape(decodeURIComponent(escape(text))));
    }
    return decoded;
  } catch (e) {
    // Si falla la decodificación, devolvemos el texto original
    return text;
  }
};
