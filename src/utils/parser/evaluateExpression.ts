import { ComplexNumber, multiply, divide } from '../complexMath';
import { tokenize, Token } from '../tokenizer';
import { parseComplexNumber } from './parseComplexNumber';

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

export const evaluateExpression = (input: string): ComplexNumber => {
  try {
    // Tek bir kompleks sayı girişi için direkt parse etmeyi dene
    if (!input.match(/[+\-*/()]/)) {
      return parseComplexNumber(input.trim());
    }

    const tokens = tokenize(input.replace(/\s+/g, ''));
    const output: Token[] = [];
    const operators: Token[] = [];

    // Shunting yard algoritması
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
        stack.push({ re: parseFloat(token.value), im: 0 });
      } else if (token.type === 'complex') {
        stack.push(parseComplexNumber(token.value));
      } else if (token.type === 'operator') {
        if (stack.length < 2) throw new Error('Geçersiz ifade');
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
            if (b.re === 0 && b.im === 0) throw new Error('Sıfıra bölme hatası');
            stack.push(divide(a, b));
            break;
        }
      }
    }

    if (stack.length !== 1) throw new Error('Geçersiz ifade');
    return stack[0];
  } catch (error) {
    throw new Error('Geçersiz kompleks sayı ifadesi');
  }
};