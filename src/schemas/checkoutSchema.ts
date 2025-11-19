import { z } from 'zod';

// Validação de CPF
const cpfRegex = /^\d{11}$/;
const validateCPF = (cpf: string): boolean => {
  if (!cpfRegex.test(cpf)) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validar dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};

// Validação de CEP
const cepRegex = /^\d{8}$/;

// Validação de telefone
const telefoneRegex = /^\d{10,11}$/;

export const checkoutSchema = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  
  cpf: z.string()
    .regex(cpfRegex, 'CPF deve conter 11 dígitos')
    .refine(validateCPF, 'CPF inválido'),
  
  telefone: z.string()
    .regex(telefoneRegex, 'Telefone deve conter 10 ou 11 dígitos')
    .optional(),
  
  modo: z.enum(['ENTREGA', 'RETIRADA']),
  
  formaPagamento: z.enum([
    'Dinheiro',
    'Credito',
    'Debito',
    'Pix',
    'Vale refeicao',
    'Alimentacao'
  ]),
  
  endereco: z.object({
    rua: z.string()
      .min(3, 'Rua deve ter pelo menos 3 caracteres')
      .max(200, 'Rua deve ter no máximo 200 caracteres'),
    
    numero: z.string()
      .min(1, 'Número é obrigatório')
      .max(10, 'Número deve ter no máximo 10 caracteres'),
    
    bairro: z.string()
      .min(3, 'Bairro deve ter pelo menos 3 caracteres')
      .max(100, 'Bairro deve ter no máximo 100 caracteres'),
    
    cidade: z.string()
      .min(3, 'Cidade deve ter pelo menos 3 caracteres')
      .max(100, 'Cidade deve ter no máximo 100 caracteres'),
    
    cep: z.string()
      .regex(cepRegex, 'CEP deve conter 8 dígitos')
  }).optional()
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
