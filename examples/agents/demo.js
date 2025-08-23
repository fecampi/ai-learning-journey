const SmartAIAgent = require("../../src/agents/SmartAIAgent");
const LogDataProvider = require("../../src/providers/LogDataProvider");
const ChatTerminal = require("../../src/agents/ChatTerminal");
require("dotenv").config();

// API Key do ambiente
const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  throw new Error("GOOGLE_API_KEY não encontrada. Configure o arquivo .env");
}

async function demo() {
  // System prompt para o agente
  const SYSTEM_PROMPT =
    "Você é um assistente educacional de IA. Responda sempre em português e explique de forma clara.";

  // Cria o agente IA
  const smartAgent = new SmartAIAgent(
    API_KEY, // API Key do Google
    "gemini-1.5-flash" // Modelo (opcional - padrão é flash)
  );

  // Cria o provedor de dados
  const logProvider = new LogDataProvider();

  // Adiciona as funções disponíveis usando addTool
  smartAgent.addTool(
    {
      name: "getLogs",
      description: "Busca logs de uma sessão específica pelo ID da sessão",
      parameters: {
        type: "object",
        properties: {
          sessionId: {
            type: "integer",
            description: "ID da sessão (101, 102, ou 103)",
          },
        },
        required: ["sessionId"],
      },
    },
    ({ sessionId }) => logProvider.getLogs(sessionId)
  );

  smartAgent.addTool(
    {
      name: "getAvailableSessions",
      description: "Lista todas as sessões disponíveis no sistema",
      parameters: {
        type: "object",
        properties: {},
      },
    },
    () => logProvider.getAvailableSessions()
  );

  const terminal = new ChatTerminal();
  await smartAgent.startSession(SYSTEM_PROMPT);
  terminal.output("DEMO EDUCACIONAL: AI AGENT COM FUNCTION CALLING");
  terminal.output("==================================================");
  terminal.output("");

  // Mostra as funções disponíveis
  const availableTools = [
    {
      name: "getLogs",
      description: "Busca logs de uma sessão específica pelo ID da sessão",
    },
    {
      name: "getAvailableSessions",
      description: "Lista todas as sessões disponíveis no sistema",
    },
  ];

  terminal.output("Bem-vindo ao agente IA!");
  terminal.output("Funções disponíveis:");
  availableTools.forEach((tool) => {
    terminal.output(`- ${tool.name}: ${tool.description}`);
  });
  terminal.output("");
  terminal.output("Chat iniciado! (Ctrl+C para encerrar e ver o log)");
  terminal.output("");

  while (true) {
    const userInput = await terminal.input("");
    const response = await smartAgent.ask(userInput);
    terminal.output(response);
  }
}

// Executa a demonstração
demo();
