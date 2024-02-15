/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { CardData } from '../types';

interface CartaoFormularioProps {
  onDataChange: (cardData: CardData) => void;
}

const CartaoFormulario = ({ onDataChange }: CartaoFormularioProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCVV] = useState('');
  const [parcelas, setParcelas] = useState(1);

  const getCardData = (): CardData | null => {
    if (cardNumber && expiryMonth && expiryYear && cvv && parcelas) {
      return {
        cardNumber,
        expiryMonth,
        expiryYear,
        cvv,
        parcelas,
      };
    }
    return null;
  };

  useEffect(() => {
    onDataChange({
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
      parcelas,
    });
  }, [cardNumber, expiryMonth, expiryYear, cvv, parcelas]);

  const precoAVista = 6000; // Substitua pelo preço à vista da sua compra

  const formatCardNumber = (input: string): string => {
    // Remove qualquer não número
    const numericInput = input.replace(/\D/g, '');

    // Adiciona um espaço a cada 4 dígitos
    const formattedInput = numericInput.replace(/(\d{4})(?=\d)/g, '$1 ');

    // Limita a 16 dígitos
    return formattedInput.slice(0, 19);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formattedInput = formatCardNumber(input);
    setCardNumber(formattedInput);
  };

  const isExpiryMonthValid = (month: string): boolean => {
    return /^\d{1,2}$/.test(month) && parseInt(month, 10) >= 1 && parseInt(month, 10) <= 12;
  };

  const isExpiryYearValid = (year: string): boolean => {
    const currentYear = new Date().getFullYear();
    return /^\d{4}$/.test(year) && parseInt(year, 10) >= currentYear && parseInt(year, 10) <= currentYear + 14;
  };

  const isCVVValid = (cvv: string): boolean => {
    return /^\d{3}$/.test(cvv);
  };

  const handleParcelasChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setParcelas(parseInt(event.target.value, 10));
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={cardNumber}
          onChange={handleCardNumberChange}
          className="w-full p-3 border-none rounded-md text-lightText placeholder-lightText focus:outline-none focus:border-primary bg-slate-800"
          placeholder="Número de Cartão de Crédito"
        />
      </div>
      <div className="mb-4 flex">
        <select
          value={expiryMonth}
          onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
          className="w-1/3 p-3 mr-2 border-none rounded-md text-lightText placeholder-lightText focus:outline-none focus:border-primary bg-slate-800"
        >
          <option value="" disabled selected hidden>
            Mês
          </option>
          {[...Array(12).keys()].map((month) => (
            <option key={month + 1} value={month + 1}>
              {month + 1}
            </option>
          ))}
        </select>
        <select
          value={expiryYear}
          onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
          className="w-1/3 p-3 mr-2 border-none rounded-md text-lightText placeholder-lightText focus:outline-none focus:border-primary bg-slate-800"
        >
          <option value="" disabled selected hidden>
            Ano
          </option>
          {[...Array(15).keys()].map((year) => (
            <option key={new Date().getFullYear() + year} value={new Date().getFullYear() + year}>
              {new Date().getFullYear() + year}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={cvv}
          onChange={(e) => setCVV(e.target.value.replace(/\D/g, '').slice(0, 3))}
          placeholder="Cód. de segurança"
          className="w-1/3 p-3 mr-2 border-none rounded-md text-lightText placeholder-lightText focus:outline-none focus:border-primary bg-slate-800"
        />
      </div>
      <div>
        <select
          value={parcelas}
          onChange={handleParcelasChange}
          className="w-full p-3 border-none rounded-md text-lightText placeholder-lightText focus:outline-none focus:border-primary bg-slate-800"
        >
          {[...Array(12).keys()].map((parcela) => (
            <option key={parcela + 1} value={parcela + 1}>
              {`${parcela + 1}x - ${(precoAVista / (parcela + 1)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CartaoFormulario;
