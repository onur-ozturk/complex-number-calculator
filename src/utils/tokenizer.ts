type Token = {
  type: 'number' | 'operator' | 'parenthesis' | 'complex';
  value: string;
};

export const tokenize = (input: string): Token[] => {
  const tokens: Token[] = [];
  const regex = /(\d*\.?\d+∠\d+|\d*\.?\d+[+-]\d*\.?\d+i|\d*\.?\d+i|\d*\.?\d+|[+\-*/()])/g;
  
  let match;
  while ((match = regex.exec(input)) !== null) {
    const value = match[0];
    
    if (value.includes('∠') || value.includes('i')) {
      tokens.push({ type: 'complex', value });
    } else if ('+-*/'.includes(value)) {
      tokens.push({ type: 'operator', value });
    } else if ('()'.includes(value)) {
      tokens.push({ type: 'parenthesis', value });
    } else {
      tokens.push({ type: 'number', value });
    }
  }
  
  return tokens;
};