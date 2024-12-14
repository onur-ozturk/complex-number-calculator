// Kompleks sayı tipi tanımlaması
export type ComplexNumber = {
  re: number;
  im: number;
};

// Kartezyen formdan kompleks sayı oluşturma
export const createCartesian = (re: number, im: number): ComplexNumber => ({
  re,
  im,
});

// Polar formdan kompleks sayı oluşturma (açı derece cinsinden)
export const createPolar = (magnitude: number, angleDegrees: number): ComplexNumber => {
  const angleRad = (angleDegrees * Math.PI) / 180;
  return {
    re: magnitude * Math.cos(angleRad),
    im: magnitude * Math.sin(angleRad),
  };
};

// Kompleks sayının modülünü hesapla
export const getMagnitude = (num: ComplexNumber): number => {
  return Math.sqrt(num.re * num.re + num.im * num.im);
};

// Kompleks sayının açısını hesapla (derece cinsinden)
export const getAngle = (num: ComplexNumber): number => {
  const angleRad = Math.atan2(num.im, num.re);
  return (angleRad * 180) / Math.PI;
};

// Temel matematiksel işlemler
export const add = (a: ComplexNumber, b: ComplexNumber): ComplexNumber => ({
  re: a.re + b.re,
  im: a.im + b.im,
});

export const subtract = (a: ComplexNumber, b: ComplexNumber): ComplexNumber => ({
  re: a.re - b.re,
  im: a.im - b.im,
});

export const multiply = (a: ComplexNumber, b: ComplexNumber): ComplexNumber => {
  // Eğer b sadece reel sayı ise (imajiner kısmı 0)
  if (b.im === 0) {
    return {
      re: a.re * b.re,
      im: a.im * b.re
    };
  }
  // Normal kompleks sayı çarpımı
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re
  };
};

export const divide = (a: ComplexNumber, b: ComplexNumber): ComplexNumber => {
  const denominator = b.re * b.re + b.im * b.im;
  return {
    re: (a.re * b.re + a.im * b.im) / denominator,
    im: (a.im * b.re - a.re * b.im) / denominator,
  };
};

// Kompleks sayıyı kartezyen formda string olarak formatla
export const formatCartesian = (num: ComplexNumber): string => {
  const re = num.re.toFixed(6);
  const im = Math.abs(num.im).toFixed(6);
  const sign = num.im >= 0 ? '+' : '-';
  return `${re} ${sign} ${im}i`;
};

// Kompleks sayıyı polar formda string olarak formatla
export const formatPolar = (num: ComplexNumber): string => {
  const magnitude = getMagnitude(num).toFixed(6);
  const angle = getAngle(num).toFixed(6);
  return `${magnitude} ∠ ${angle}°`;
};