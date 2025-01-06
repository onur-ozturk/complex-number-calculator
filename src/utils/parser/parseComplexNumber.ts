import { ComplexNumber, createCartesian, createPolar } from '../complexMath';

export const parseComplexNumber = (input: string): ComplexNumber => {
  // Boş girişi kontrol et
  if (!input.trim()) {
    throw new Error('Geçersiz giriş: Boş değer');
  }

  // Polar form kontrolü (5 ∠ 60)
  if (input.includes('∠')) {
    const [magnitude, angle] = input.split('∠').map(part => parseFloat(part.trim()));
    if (isNaN(magnitude) || isNaN(angle)) {
      throw new Error('Geçersiz polar form');
    }
    return createPolar(magnitude, angle);
  }

  // Özel durumlar kontrolü
  if (input === 'i') return createCartesian(0, 1);
  if (input === '-i') return createCartesian(0, -1);

  // Sadece imajiner kısım kontrolü (4i, -4i gibi)
  if (input.endsWith('i')) {
    const coefficient = input.slice(0, -1);
    if (coefficient === '') return createCartesian(0, 1);
    if (coefficient === '-') return createCartesian(0, -1);
    const num = parseFloat(coefficient);
    if (isNaN(num)) throw new Error('Geçersiz imajiner sayı');
    return createCartesian(0, num);
  }

  // Kartezyen form parse etme (3+5i veya 3-5i)
  const parts = input.match(/^([-+]?\d*\.?\d*)?(?:([-+])?(\d*\.?\d*)?i)?$/);
  if (!parts) throw new Error('Geçersiz kompleks sayı formatı');

  let real = 0;
  let imag = 0;

  // Reel kısım
  if (parts[1] && parts[1] !== '+' && parts[1] !== '-') {
    real = parseFloat(parts[1]);
    if (isNaN(real)) throw new Error('Geçersiz reel kısım');
  }

  // İmajiner kısım
  if (parts[2] || parts[3]) {
    let imagStr = parts[3] || '1';
    if (parts[2] === '-') imagStr = '-' + imagStr;
    imag = parseFloat(imagStr);
    if (isNaN(imag)) throw new Error('Geçersiz imajiner kısım');
  }

  return createCartesian(real, imag);
};