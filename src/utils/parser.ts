import { ComplexNumber, createCartesian, createPolar, multiply, divide } from './complexMath';
import { tokenize } from './tokenizer';

export const parseComplexNumber = (input: string): ComplexNumber => {
  // Polar form kontrolü (5 ∠ 60)
  if (input.includes('∠')) {
    const [magnitude, angle] = input.split('∠').map(part => parseFloat(part.trim()));
    return createPolar(magnitude, angle);
  }
  
  // Sadece i veya sayı*i formatı kontrolü (4i, -4i gibi)
  if (input === 'i') {
    return createCartesian(0, 1);
  }
  if (input === '-i') {
    return createCartesian(0, -1);
  }
  if (input.endsWith('i')) {
    // Başındaki - işareti dahil sayıyı al
    const num = input.slice(0, -1);
    // Boş string, sadece - işareti veya sayı olabilir
    return createCartesian(0, num === '' ? 1 : num === '-' ? -1 : parseFloat(num));
  }
  
  // Kartezyen form parse etme (3+5i veya 3-5i)
  const parts = input.match(/^([-+]?\d*\.?\d*)?(?:([-+])?(\d*\.?\d*)?i)?$/);
  if (!parts) throw new Error('Geçersiz kompleks sayı formatı');
  
  let real = 0;
  let imag = 0;
  
  // Reel kısım
  if (parts[1] && parts[1] !== '+' && parts[1] !== '-') {
    real = parseFloat(parts[1]);
  }
  
  // İmajiner kısım
  if (parts[2] || parts[3]) {
    let imagStr = parts[3] || '1'; // Eğer katsayı belirtilmemişse 1 kullan
    if (parts[2] === '-') {
      imagStr = '-' + imagStr;
    }
    imag = parseFloat(imagStr);
  }
  
  return createCartesian(real, imag);
};

export const evaluateExpression = (input: string): ComplexNumber => {
  const tokens = tokenize(input.replace(/\s+/g, ''));
  
  // Yardımcı fonksiyon: Operatör önceliği
  const precedence = (op: string): number => {
    switch (op) {
      case '+':
      case '-':
        return 1;
      case '*':
      case '/':
        return 2;
      default:
        return 0;
    }
  };
  
  // Shunting yard algoritması
  const output: Token[] = [];
  const operators: Token[] = [];
  
  for (const token of tokens) {
    if (token.type === 'number' || token.type === 'complex') {
      output.push(token);
    } else if (token.type === 'operator') {
      while (
        operators.length > 0 &&
        operators[operators.length - 1].type === 'operator' &&
        precedence(operators[operators.length - 1].value) >= precedence(token.value)
      ) {
        output.push(operators.pop()!);
      }
      operators.push(token);
    } else if (token.value === '(') {
      operators.push(token);
    } else if (token.value === ')') {
      while (operators.length > 0 && operators[operators.length - 1].value !== '(') {
        output.push(operators.pop()!);
      }
      operators.pop(); // '(' parantezini at
    }
  }
  
  while (operators.length > 0) {
    output.push(operators.pop()!);
  }
  
  // RPN değerlendirme
  const stack: ComplexNumber[] = [];
  
  for (const token of output) {
    if (token.type === 'number') {
      stack.push(createCartesian(parseFloat(token.value), 0));
    } else if (token.type === 'complex') {
      stack.push(parseComplexNumber(token.value));
    } else if (token.type === 'operator') {
      const b = stack.pop()!;
      const a = stack.pop()!;
      
      switch (token.value) {
        case '+':
          stack.push({ re: a.re + b.re, im: a.im + b.im });
          break;
        case '-':
          stack.push({ re: a.re - b.re, im: a.im - b.im });
          break;
        case '*':
          stack.push(multiply(a, b));
          break;
        case '/':
          stack.push(divide(a, b));
          break;
      }
    }
  }
  
  return stack[0];
};