export interface FormData {
    fullName: string;
    email: string;
    confirmEmail: string;
    cpf: string;
    cellphone: string;
    cardData: CardData; // Remova a inicialização e use o tipo CardData diretamente
    errors: {
      fullName: string;
      email: string;
      confirmEmail: string;
      cpf: string;
      cellphone: string;
      general: string;
    };
}
  
export interface CardData {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    parcelas: number; // Adicione a propriedade parcelas como opcional se necessário
}