// =============================================
// DEMO EDUCACIONAL: AI AGENTS COM FUNCTION CALLING
// Exemplo prático de como criar agentes IA que podem executar funções
// =============================================

// Carrega variáveis de ambiente
require('dotenv').config();

// Importações
const SmartAIAgent = require('../../src/agents/SmartAIAgent');
const LogDataProvider = require('../../src/providers/LogDataProvider');
const availableFunctions = require('../../src/config/functions');

// API Key do ambiente
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  throw new Error('GOOGLE_API_KEY não encontrada. Configure o arquivo .env');
}

// =============================================
// DEMO PRÁTICA: TESTANDO O AGENTE
// =============================================

// Cria o provedor de dados
const logProvider = new LogDataProvider();

// Cria o agente IA com todas as configurações
const smartAgent = new SmartAIAgent(
  API_KEY,              // API Key do Google
  logProvider,          // Provedor de dados
  availableFunctions,   // Funções disponíveis
  "gemini-1.5-flash"    // Modelo (opcional - padrão é flash)
  // Outros modelos disponíveis:
  // "gemini-1.5-pro"     - Mais inteligente, mas mais lento
  // "gemini-1.0-pro"     - Versão anterior
);

// VANTAGEM DO MODELO NO CONSTRUTOR:
// Agora você pode facilmente testar diferentes modelos:
// const agentFlash = new SmartAIAgent(API_KEY, logProvider, availableFunctions, "gemini-1.5-flash");
// const agentPro = new SmartAIAgent(API_KEY, logProvider, availableFunctions, "gemini-1.5-pro");

// FUNÇÃO DE TESTE EDUCACIONAL
async function demonstrarFunctionCalling() {
  console.log("DEMO EDUCACIONAL: AI AGENT COM FUNCTION CALLING");
  console.log("==================================================");
  console.log("Este exemplo demonstra como criar um agente IA que pode:");
  console.log("• Receber perguntas em linguagem natural");
  console.log("• Decidir automaticamente quais funções executar");
  console.log("• Executar funções dinamicamente");
  console.log("• Retornar respostas baseadas nos dados obtidos");
  console.log("");
  
  // TESTE 1: Solicitação de logs específicos
  console.log("TESTE 1: Solicitando logs de uma sessão específica");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const response1 = await smartAgent.ask("Show me logs from session 102");
  console.log("Resposta Final:", response1);
  console.log("");
  
  // TESTE 2: Listagem de sessões disponíveis  
  console.log("TESTE 2: Descobrindo quais sessões estão disponíveis");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const response2 = await smartAgent.ask("What sessions are available?");
  console.log("Resposta Final:", response2);
  console.log("");
  
  // TESTE 3: Demonstração do histórico de conversas
  console.log("TESTE 3: Testando memória de contexto (histórico)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const response3 = await smartAgent.ask("Show me logs from the first session you mentioned");
  console.log("Resposta Final:", response3);
  
  console.log("");
  console.log("DEMO CONCLUÍDA! O agente demonstrou:");
  console.log("• Function calling automático");
  console.log("• Execução dinâmica de funções"); 
  console.log("• Manutenção de contexto entre perguntas");
}

// Executa a demonstração
demonstrarFunctionCalling();
