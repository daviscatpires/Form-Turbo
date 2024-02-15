/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import Modal from 'react-modal';
import CartaoFormulario from './CartaoFormulario';
import BoletoFormulario from './BoletoFormulario';
import { isFullNameValid, areEmailsMatching, isEmailValid, formatCPF, isCPFValid, formatCellphone, isCellphoneValid, sanitizeString, isCreditCardNumberValid } from '../utils/validation';
import { CardData, FormData } from '../types/index';

Modal.setAppElement('#root');

const Form = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const [cardDataReady, setCardDataReady] = useState(false)
  const [cardFieldsFilled, setCardFieldsFilled] = useState(false);
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');
  const [saveDataChecked, setSaveDataChecked] = useState(false);
  const [errorFields, setErrorFields] = useState<Set<string>>(new Set());
  const [cpf, setCPF] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [opcaoPagamento, setOpcaoPagamento] = useState('');
  const [cartaoData, setCartaoData] = useState<CardData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    confirmEmail: '',
    cpf: '',
    cellphone: '',
    cardData: { cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '', parcelas: 0 },
    errors: {
      fullName: '',
      email: '',
      confirmEmail: '',
      cpf: '',
      cellphone: '',
      general: '',
    },
  });

  const handleCardSubmit = (cardData: CardData) => {
    setCartaoData(cardData);
  
    const areCardFieldsFilled =
      cardData.cardNumber &&
      cardData.expiryMonth &&
      cardData.expiryYear &&
      cardData.cvv &&
      cardData.parcelas > 0;
  
    const isCardNumberValid = isCreditCardNumberValid(cardData.cardNumber);
  
    setCardFieldsFilled(Boolean(areCardFieldsFilled && isCardNumberValid));
  };
  

    // Funções de manipulação do estado para os campos do formulário
    const handleFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const fullName = event.target.value;
      setFormData((prevFormData) => ({
        ...prevFormData,
        fullName,
        errors: {
          ...prevFormData.errors,
          fullName: isFullNameValid(fullName) ? '' : 'Nome inválido',
          general: '', // Limpar a mensagem de erro geral ao corrigir um campo
        },
      }));
    };
    
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const email = event.target.value;
      setFormData((prevFormData) => ({
        ...prevFormData,
        email,
        errors: {
          ...prevFormData.errors,
          email: isEmailValid(email) ? '' : 'Email inválido',
          general: '', // Limpar a mensagem de erro geral ao corrigir um campo
        },
      }));
    };
    
    const handleConfirmEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const confirmEmail = event.target.value;
      setFormData((prevFormData) => ({
        ...prevFormData,
        confirmEmail,
        errors: {
          ...prevFormData.errors,
          confirmEmail: areEmailsMatching(prevFormData.email, confirmEmail) ? '' : 'Emails não coincidem',
          general: '', // Limpar a mensagem de erro geral ao corrigir um campo
        },
      }));
    };
    
    const formatCPF = (input: string): string => {
      // Remover caracteres não numéricos
      const numericInput = input.replace(/\D/g, '');
    
      // Limitar a 11 dígitos
      const limitedInput = numericInput.slice(0, 11);
    
      // Adicionar pontos e traço conforme o formato do CPF
      const formattedInput = limitedInput.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    
      return formattedInput;
    };
  
    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const formattedInput = formatCPF(input);
      setCPF(formattedInput);
      setFormData((prevFormData) => ({
        ...prevFormData,
        cpf: formattedInput,
        errors: {
          ...prevFormData.errors,
          cpf: isCPFValid(input) ? '' : 'CPF inválido',
          general: '',
        },
      }));
    };
  
    const formatCellphone = (input: string): string => {
      // Remover caracteres não numéricos
      const numericInput = input.replace(/\D/g, '');
    
      // Limitar a 11 dígitos
      const limitedInput = numericInput.slice(0, 11);
    
      // Adicionar parênteses, espaço e traço conforme o formato do celular
      const formattedInput = limitedInput.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    
      return formattedInput;
    };
  
    const handleCellphoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const formattedInput = formatCellphone(input);
      setCellphone(formattedInput);
      setFormData((prevFormData) => ({
        ...prevFormData,
        cellphone: formattedInput,
        errors: {
          ...prevFormData.errors,
          cellphone: isCellphoneValid(input) ? '' : 'Número de celular inválido',
          general: '',
        },
      }));
    };
    
    // Função para validar o formulário
    const isFormValid = (): boolean => {
      const isPersonalInfoValid =
        isFullNameValid(formData.fullName) &&
        areEmailsMatching(formData.email, formData.confirmEmail) &&
        isCPFValid(formData.cpf) &&
        isCellphoneValid(formData.cellphone);
  
      const isCardDataValid =
        opcaoPagamento === 'cartao' &&
        cardFieldsFilled;
  
      return isPersonalInfoValid && isCardDataValid && saveDataChecked;
    };

    const handleFinalizarClick = () => {
      const currentErrorFields = new Set<string>();

      if (!opcaoPagamento) {
        currentErrorFields.add('Forma de Pagamento');
      }
    
      // Verificar erros nos campos de informação pessoal
      if (!isFullNameValid(formData.fullName)) {
        currentErrorFields.add('Nome Completo');
      }
      if (!isEmailValid(formData.email)) {
        currentErrorFields.add('Email');
      }
      if (!areEmailsMatching(formData.email, formData.confirmEmail)) {
        currentErrorFields.add('Confirmar Email');
      }
      if (!isCPFValid(formData.cpf)) {
        currentErrorFields.add('CPF');
      }
      if (!isCellphoneValid(formData.cellphone)) {
        currentErrorFields.add('Celular com DDD');
      }
      if (!isCellphoneValid(formData.cellphone)) {
        currentErrorFields.add('Celular com DDD');
      }

      if(!saveDataChecked) {
        currentErrorFields.add('Marcar checkbox')
      }
    
      // Verificar erros nos campos de cartão, se aplicável
      if (opcaoPagamento === 'cartao') {
        if (!cardFieldsFilled) {
          currentErrorFields.add('Campos do Cartão');
        }
      }
    
      // Atualizar estado com os campos com erro
      setErrorFields(currentErrorFields);
    
      // Abrir modal de erro se houver campos com erro
      if (currentErrorFields.size > 0) {
        setErrorModalIsOpen(true);
        setErrorModalMessage("Por favor, corrija os erros no formulário antes de finalizar.");
      } else if ((opcaoPagamento === 'boleto' || isFormValid()) && saveDataChecked) {
        // Se não houver erros, exibir o modal com os dados do usuário
        setModalIsOpen(true);
      }
    };

    const closeModal = () => {
      setModalIsOpen(false);
    }

  return (
    <div className="bg-slate-900 p-8 rounded-lg shadow-md w-full sm:w-96 lg:w-1/3 text-lightText">
      <h2 className="text-3xl font-bold mb-6 text-yellow-500 text-center">
        Formulário de Cadastro
      </h2>

      {/* Campos de Informação Pessoal */}
      <div className="mb-4">
        <input
          type="text"
          value={formData.fullName}
          onChange={handleFullNameChange}
          className="w-full p-3 border-none rounded-md text-lightText placeholder-lightText focus:outline-none focus:border-primary bg-slate-800"
          placeholder="Nome Completo"
          required
        />
        <span className="text-sm text-red-500">{formData.errors.fullName}</span>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="w-full p-3 border-none rounded-md text-lightText placeholder-lightText focus:outline-none focus:border-primary bg-slate-800"
          placeholder="Email"
          onChange={handleEmailChange}
          required
        />
        <span className="text-sm text-red-500">{formData.errors.email}</span>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="w-full p-3 border-none rounded-md text-lightText placeholder-lightText focus:outline-none focus:border-primary bg-slate-800"
          placeholder="Confirmar email"
          onChange={handleConfirmEmailChange}
          required
        />
        <span className="text-sm text-red-500">{formData.errors.confirmEmail}</span>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center">
        <input
          type="text"
          className="w-full sm:w-1/2 p-3 mb-2 sm:mr-2 border-none rounded-md text-lightText placeholder-lightText focus:outline-none focus:border-primary bg-slate-800"
          value={cpf}
          placeholder="CPF"
          onChange={handleCPFChange}
          required
        />
        <input
          type="text"
          className="w-full sm:w-1/2 p-3 sm:mb-2 border-none rounded-md text-lightText placeholder-lightText focus:outline-none focus:border-primary bg-slate-800"
          value={cellphone}
          placeholder="Celular com DDD"
          onChange={handleCellphoneChange}
          required
        />
      </div>

      {/* Seleção de Método de Pagamento */}
      <div className="mb-4 flex justify-center">
        <div className="flex">
          <button
            className={`mr-4 px-6 py-3 rounded-md ${
              opcaoPagamento === 'cartao' ? 'bg-primary text-darkText' : ' bg-slate-800 text-lightText'
            }`}
            onClick={() => setOpcaoPagamento('cartao')}
          >
            Cartão
          </button>
          <button
            className={`px-6 py-3 rounded-md ${
              opcaoPagamento === 'boleto' ? 'bg-primary text-darkText' : ' bg-slate-800 text-lightText'
            }`}
            onClick={() => setOpcaoPagamento('boleto')}
          >
            Boleto
          </button>
        </div>
      </div>

      {/* Renderização Condicional de Formulário de Pagamento */}
      {opcaoPagamento === 'cartao' && <CartaoFormulario onDataChange={handleCardSubmit} />}
      {opcaoPagamento === 'boleto' && <BoletoFormulario />}

      {/* Salvar Dados Checkbox */}
      <div className="mb-4 mt-2">
        <label className="flex items-center text-lightText">
          <input type="checkbox" className="form-checkbox mr-2" required checked={saveDataChecked}
            onChange={() => setSaveDataChecked(!saveDataChecked)}/>
          Concordo com os termos
        </label>
      </div>

      {/* Mensagem de Proteção de Dados */}
      <p className="text-sm text-lightText">
        Nós protegemos seus dados de pagamento usando encriptação para prover segurança no nível de bancos.
      </p>
      {formData.errors.general && (
      <div className="mb-4">
        <span className="text-sm text-red-500">{formData.errors.general}</span>
      </div>
    )}     
      {/* Botão de Finalizar */}
      <button className="mt-6 bg-buttonHover text-white py-3 px-6 rounded-md" onClick={handleFinalizarClick} >
        Finalizar
      </button>  

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Dados do Usuário"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 p-8 rounded-md shadow-md text-lightText">
          <h2 className="text-2xl font-bold mb-4">Dados do Usuário</h2>
          <p className="mb-2">Nome: {formData.fullName}</p>
          <p className="mb-2">Email: {formData.email}</p>
          <p className="mb-2">CPF: {formData.cpf}</p>
          <p className="mb-2">Celular: {formData.cellphone}</p>
          <p className="mb-2">Método de Pagamento: {opcaoPagamento}</p>
          {opcaoPagamento === 'cartao' && (
            <>
              <p className="mb-2">Número do Cartão: {cartaoData?.cardNumber}</p>
              <p className="mb-2">Mês de Expiração: {cartaoData?.expiryMonth}</p>
              <p className="mb-2">Ano de Expiração: {cartaoData?.expiryYear}</p>
              <p className="mb-2">CVV: {cartaoData?.cvv}</p>
              <p className="mb-2">Parcelas: {cartaoData?.parcelas}</p>
            </>
          )}
          <button className="bg-buttonHover text-white py-2 px-4 rounded-md" onClick={closeModal}>
            Fechar
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={errorModalIsOpen}
        onRequestClose={() => setErrorModalIsOpen(false)}
        contentLabel="Erro no Formulário"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 p-8 rounded-md shadow-md text-lightText">
          <h2 className="text-2xl font-bold mb-4">Erro no Formulário</h2>
          <p>{errorModalMessage}</p>
          
          {errorFields.size > 0 && (
            <>
              <p className="text-sm font-bold mt-4">Campos com erro:</p>
              <ul className="list-disc pl-6">
                {[...errorFields].map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </>
          )}
          <button className="bg-buttonHover text-white py-2 px-4 rounded-md mt-2" onClick={() => setErrorModalIsOpen(false)}>
            Fechar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Form;
