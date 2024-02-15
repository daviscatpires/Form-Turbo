/* eslint-disable @typescript-eslint/no-unused-vars */
// src/utils/validation.tsx

export const isFullNameValid = (fullName: string): boolean => {
  const nameParts = fullName.split(' ');
  return nameParts.length >= 2;
};

export const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const areEmailsMatching = (email: string, confirmEmail: string): boolean => {
  return email === confirmEmail;
};

export const sanitizeString = (value: string): string => value.replace(/\D/g, '');

export const formatCPF = (cpf: string): string => {
  const sanitizedCPF = sanitizeString(cpf);
  return sanitizedCPF.slice(0, 14).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const isCPFValid = (cpf: string): boolean => {
  const cleanedCPF = sanitizeString(cpf);

  if (cleanedCPF.length !== 11 || /^(\d)\1+$/.test(cleanedCPF)) {
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanedCPF.charAt(i - 1), 10) * (11 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(cleanedCPF.charAt(9), 10)) {
    return false;
  }

  sum = 0;

  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanedCPF.charAt(i - 1), 10) * (12 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  return remainder === parseInt(cleanedCPF.charAt(10), 10);
};

export const formatCellphone = (cellphone: string): string => {
  const sanitizedCellphone = sanitizeString(cellphone);
  return sanitizedCellphone.slice(0, 15).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

export const isCellphoneValid = (cellphone: string): boolean => {
  const sanitizedCellphone = sanitizeString(cellphone);

  if (sanitizedCellphone.length !== 11) {
    return false;
  }

  // Adicione a lógica de validação de número de celular aqui

  return true; // ou false, dependendo da validação
};

export const isCreditCardNumberValid = (cardNumber: string): boolean => {
  // Remover espaços em branco e caracteres não numéricos
  const numericCardNumber = cardNumber.replace(/\D/g, '');

  // Verificar se o número é fornecido e possui no mínimo 2 dígitos
  if (!numericCardNumber || numericCardNumber.length < 2) {
    return false;
  }

  // Converter o número do cartão para um array de dígitos
  const digits = numericCardNumber.split('').map(Number);

  // Inverter o array de dígitos
  digits.reverse();

  // Aplicar o Algoritmo de Luhn
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i];

    // Se o índice é ímpar, dobrar o valor do dígito
    if (i % 2 === 1) {
      digit *= 2;

      // Se o resultado for maior que 9, subtrair 9
      if (digit > 9) {
        digit -= 9;
      }
    }

    // Somar o dígito ao total
    sum += digit;
  }

  // O número é válido se a soma é um múltiplo de 10
  return sum % 10 === 0;
};