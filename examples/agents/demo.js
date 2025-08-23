const SmartAIAgent = require("../../src/agents/SmartAIAgent");
const LogDataProvider = require("../../src/providers/LogDataProvider");
const ChatTerminal = require("../../src/utils/ChatTerminal");
require("dotenv").config();

// API Key do ambiente
const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  throw new Error("GOOGLE_API_KEY não encontrada. Configure o arquivo .env");
}

async function demo() {
  // System prompt para o agente
  const SYSTEM_PROMPT = `Você é um assistente de IA com acesso a funções (tools) que podem ser usadas para responder perguntas do usuário. Sempre que possível, utilize as funções disponíveis para obter informações, mesmo que precise executar várias funções em sequência (ex: obter uma lista e depois buscar detalhes de um item).

Considere que "primeira sessão" significa a sessão com o menor ID retornado pela função getAvailableSessions. Sempre que o usuário pedir pela primeira sessão, utilize o menor ID disponível.

Se a resposta exigir múltiplas etapas, use as funções em cadeia, sem pedir confirmação ao usuário e sem explicar o processo. Retorne apenas o resultado final solicitado.

Se necessário, você pode processar, filtrar ou resumir os dados retornados pelas funções antes de responder ao usuário. Por exemplo, se a função retornar uma lista de logs, você pode filtrar apenas os logs que contenham a palavra "erro" ou fazer um resumo.

Se não for possível responder usando as funções, explique o motivo de forma clara.`;

  // Cria o agente IA
  const smartAgent = new SmartAIAgent(
    API_KEY, // API Key do Google
    "gemini-1.5-flash", // Modelo (opcional - padrão é flash)
    true
  );

  // Cria o provedor de dados
  const logProvider = new LogDataProvider();

  // Adiciona as funções disponíveis usando addTool
  smartAgent.addTool(
    {
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
      },
    },
    ({ sessionId }) => logProvider.getLogs(sessionId)
  );

  smartAgent.addTool(
    {
      name: "getAvailableSessions",
      description: "Retorna um array de IDs numéricos de todas as sessões disponíveis no sistema, em ordem crescente. Use esta função para obter o menor ID de sessão e, em seguida, caso precise utilize getLogs para buscar os logs dessa sessão.",
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
      description: "Busca os logs (erros, avisos, eventos) de uma sessão específica pelo ID da sessão. Use esta função após obter o ID da sessão com getAvailableSessions.",
    },
    {
      name: "getAvailableSessions",
      description: "Retorna um array de IDs numéricos de todas as sessões disponíveis no sistema, em ordem crescente. Use esta função para obter o menor ID de sessão e, em seguida, utilize getLogs para buscar os logs dessa sessão.",
    },
  ];

  terminal.output("Bem-vindo ao agente IA!");
  terminal.output("Funções disponíveis:");
  availableTools.forEach((tool) => {
    terminal.output(`- ${tool.name}: ${tool.description}`);
  });

  while (true) {
    const userInput = await terminal.input("");
    const response = await smartAgent.ask(userInput);
    terminal.output(response);
  }
}

// Executa a demonstração
demo();
