/**
 * Registro de tools específicas para gerenciamento de logs
 */

const logTools = {
  getLogs: {
    name: "getLogs",
    description: "Busca os logs (erros, avisos, eventos) de uma sessão específica pelo ID da sessão. Caso não saiba o ID, utilize getAvailableSessions para obter um ID válido antes de chamar esta função.",
    parameters: {
      type: "object",
      properties: {
        sessionId: {
          type: "integer",
          description: "ID da sessão (101, 102, ou 103). Se não souber o ID, obtenha usando getAvailableSessions.",
        },
      },
      required: ["sessionId"],
    }
  },

  getAvailableSessions: {
    name: "getAvailableSessions",
    description: "Retorna lista de sessões disponíveis com seus IDs e descrições.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    }
  },

  searchLogs: {
    name: "searchLogs",
    description: "Busca logs por palavra-chave em todas as sessões ou em uma sessão específica.",
    parameters: {
      type: "object",
      properties: {
        keyword: {
          type: "string",
          description: "Palavra-chave para buscar nos logs",
        },
        sessionId: {
          type: "integer",
          description: "ID da sessão específica (opcional). Se não fornecido, busca em todas as sessões.",
        },
      },
      required: ["keyword"],
    }
  }
};

module.exports = { logTools };
