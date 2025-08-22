// =============================================
// CONFIGURAÇÃO DE FUNÇÕES DISPONÍVEIS PARA A IA
// Define quais funções a IA pode chamar e como usá-las
// =============================================

const availableFunctions = [
  {
    // Nome da função (deve corresponder ao método no LogDataProvider)
    name: "getLogs",
    
    // Descrição para a IA entender quando usar esta função
    description: "Busca logs de uma sessão específica pelo ID da sessão",
    
    // Parâmetros que a função aceita (formato JSON Schema)
    parameters: {
      type: "object",
      properties: {
        sessionId: { 
          type: "integer", 
          description: "ID da sessão (101, 102, ou 103)" 
        }
      },
      required: ["sessionId"] // Parâmetros obrigatórios
    }
  },
  {
    name: "getAvailableSessions",
    description: "Lista todas as sessões disponíveis no sistema",
    parameters: { 
      type: "object", 
      properties: {} // Esta função não precisa de parâmetros
    }
  }
];

module.exports = availableFunctions;
