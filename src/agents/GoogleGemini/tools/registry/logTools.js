/**
 * Registro de tools específicas para gerenciamento de logs
 */

const logTools = {
  getLogs: {
    name: "getLogs",
    description:
      "Busca os logs (erros, avisos, eventos) de uma sessão específica pelo ID da sessão. Caso não saiba o ID, utilize getAvailableSessions para obter um ID válido antes de chamar esta função.",
    parameters: {
      type: "object",
      properties: {
        sessionId: {
          type: "integer",
          description:
            "ID da sessão (101, 102, ou 103). Se não souber o ID, obtenha usando getAvailableSessions.",
        },
      },
      required: ["sessionId"],
    },
  },

  getAvailableSessions: {
    name: "getAvailableSessions",
    description:
      "Retorna lista de sessões disponíveis com seus IDs e descrições.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  getDeviceModel: {
    name: "getDeviceModel",
    description: "Retorna o modelo do device atual.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

module.exports = { logTools };
