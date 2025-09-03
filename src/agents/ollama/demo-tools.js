/**
 * Demonstração de Function Calling com Ollama Agent
 * Exemplo de como usar tools com o agente
 */

const OllamaGemma3Agent = require('./agents/ollamaAgent');

// Simulando um provedor de dados
class MockDataProvider {
  getLogs(sessionId) {
    const logs = {
      101: [
        "[INFO] Sessão iniciada às 14:30",
        "[ERROR] Falha na conexão com banco de dados - timeout após 30s",
        "[WARN] Tentativa de reconexão 1/3",
        "[ERROR] Falha crítica no módulo de autenticação",
        "[INFO] Sessão finalizada às 14:45"
      ],
      102: [
        "[INFO] Sistema iniciado",
        "[WARN] Memória baixa detectada (85% usage)",
        "[INFO] Backup automático concluído"
      ],
      103: [
        "[ERROR] Falha de segurança - tentativa de acesso não autorizado",
        "[WARN] Rate limit ativado",
        "[INFO] Sistema em modo de segurança"
      ]
    };
    
    return logs[sessionId] || ["[ERROR] Sessão não encontrada"];
  }

  getAvailableSessions() {
    return [101, 102, 103];
  }

  getSystemStatus() {
    return {
      status: "running",
      uptime: "2 days, 14 hours",
      cpu_usage: "45%",
      memory_usage: "78%",
      active_sessions: 3
    };
  }
}

async function demonstrarFunctionCalling() {
  console.log("🛠️ DEMONSTRAÇÃO DE FUNCTION CALLING - OLLAMA");
  console.log("=" .repeat(50));
  
  try {
    // Criar agente e provedor de dados
    const agent = new OllamaGemma3Agent();
    const dataProvider = new MockDataProvider();
    
    // Adicionar tools ao agente
    agent.addTool({
      name: "getLogs",
      description: "Busca logs de uma sessão específica pelo ID",
      parameters: {
        type: "object",
        properties: {
          sessionId: { type: "integer", description: "ID da sessão (101, 102, ou 103)" }
        },
        required: ["sessionId"]
      }
    }, ({ sessionId }) => dataProvider.getLogs(sessionId));

    agent.addTool({
      name: "getAvailableSessions",
      description: "Lista todas as sessões disponíveis no sistema",
      parameters: {
        type: "object",
        properties: {}
      }
    }, () => dataProvider.getAvailableSessions());

    agent.addTool({
      name: "getSystemStatus",
      description: "Obtém status atual do sistema",
      parameters: {
        type: "object",
        properties: {}
      }
    }, () => dataProvider.getSystemStatus());

    // Teste 1: Pergunta que deve usar tool
    console.log("\n🧪 TESTE 1: Pergunta que deve usar getLogs");
    console.log("-".repeat(40));
    console.log("Pergunta: Quais são os logs da sessão 101?");
    
    const result1 = await agent.generate("Quais são os logs da sessão 101?");
    console.log("Resposta:", result1.extractedText);
    if (result1.toolUsed) {
      console.log("✅ Tool usada:", result1.toolUsed);
    }

    // Teste 2: Pergunta que deve usar tool para listar sessões
    console.log("\n🧪 TESTE 2: Pergunta que deve usar getAvailableSessions");
    console.log("-".repeat(40));
    console.log("Pergunta: Quais sessões estão disponíveis?");
    
    const result2 = await agent.generate("Quais sessões estão disponíveis?");
    console.log("Resposta:", result2.extractedText);
    if (result2.toolUsed) {
      console.log("✅ Tool usada:", result2.toolUsed);
    }

    // Teste 3: Pergunta que pode não usar tool
    console.log("\n🧪 TESTE 3: Pergunta conceitual");
    console.log("-".repeat(40));
    console.log("Pergunta: O que são logs de sistema?");
    
    const result3 = await agent.generate("O que são logs de sistema?");
    console.log("Resposta:", result3.extractedText);
    if (result3.toolUsed) {
      console.log("✅ Tool usada:", result3.toolUsed);
    } else {
      console.log("ℹ️ Resposta sem usar tools");
    }

    console.log("\n✅ Demonstração concluída!");

  } catch (error) {
    console.error("❌ Erro na demonstração:", error.message);
    console.log("\n💡 Dica: Certifique-se de que o Ollama está rodando:");
    console.log("   ollama serve");
    console.log("   ollama run gemma3:270m");
  }
}

// Executar se arquivo foi chamado diretamente
if (require.main === module) {
  demonstrarFunctionCalling();
}

module.exports = { demonstrarFunctionCalling };
