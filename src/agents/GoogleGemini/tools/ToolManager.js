class ToolManager {
  static getCalls(candidate) {
    if (candidate && candidate.parts) {
      const calls = candidate.parts
        .filter((p) => p.functionCall)
        .map((p) => ({
          name: p.functionCall.name,
          args: p.functionCall.args,
        }));
      return calls.length > 0 ? calls : null;
    }
    return null;
  }
  constructor() {
    this.tools = [
      {
        function_declarations: [
          {
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
          {
            name: "getAvailableSessions",
            description:
              "Retorna lista de sessões disponíveis com seus IDs e descrições.",
            parameters: {
              type: "object",
              properties: {},
              required: [],
            },
          },
          {
            name: "getDeviceModel",
            description: "Retorna o modelo do device atual.",
            parameters: {
              type: "object",
              properties: {},
              required: [],
            },
          },
        ],
      },
    ];
  }

  addTool(tool) {
    this.tools.push(tool);
  }

  addTools(tools) {
    if (Array.isArray(tools)) {
      // Se receber array de tools
      tools.forEach((tool) => this.addTool(tool));
    } else if (typeof tools === "object") {
      // Se receber objeto com tools (como logTools)
      Object.values(tools).forEach((tool) => this.addTool(tool));
    } else {
      throw new Error(
        "addTools espera um array de tools ou um objeto contendo tools"
      );
    }
  }

  getTools() {
    return this.tools;
  }
}

module.exports = { ToolManager };
