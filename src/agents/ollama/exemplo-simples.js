/**
 * Exemplo Simples de Function Calling
 * Como usar tools básicas com o agente Ollama
 */

const { OllamaCrew } = require('./index.js');

async function exemploSimples() {
  console.log("🔧 EXEMPLO SIMPLES: Function Calling");
  console.log("=" .repeat(40));
  
  try {
    // Criar crew
    const crew = new OllamaCrew();
    
    // Adicionar uma tool simples
    crew.addTool({
      name: "getCurrentTime",
      description: "Obtém a data e hora atual",
      parameters: {
        type: "object",
        properties: {}
      }
    }, () => {
      return new Date().toLocaleString('pt-BR');
    });

    crew.addTool({
      name: "calculate",
      description: "Realiza cálculos matemáticos simples",
      parameters: {
        type: "object",
        properties: {
          operation: { type: "string", description: "Operação: add, subtract, multiply, divide" },
          a: { type: "number", description: "Primeiro número" },
          b: { type: "number", description: "Segundo número" }
        },
        required: ["operation", "a", "b"]
      }
    }, ({ operation, a, b }) => {
      switch (operation) {
        case "add": return a + b;
        case "subtract": return a - b;
        case "multiply": return a * b;
        case "divide": return b !== 0 ? a / b : "Erro: divisão por zero";
        default: return "Operação inválida";
      }
    });

    // Teste 1: Pergunta sobre tempo
    console.log("\n🕐 Pergunta: Que horas são agora?");
    const result1 = await crew.executeTask("Que horas são agora?");
    console.log("Resposta:", result1.extractedText);
    if (result1.toolUsed) console.log("Tool usada:", result1.toolUsed);

    // Teste 2: Pergunta sobre cálculo
    console.log("\n🧮 Pergunta: Quanto é 15 + 27?");
    const result2 = await crew.executeTask("Quanto é 15 + 27?");
    console.log("Resposta:", result2.extractedText);
    if (result2.toolUsed) console.log("Tool usada:", result2.toolUsed);

    console.log("\n✅ Exemplo concluído!");
    
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
}

// Executar se arquivo foi chamado diretamente
if (require.main === module) {
  exemploSimples();
}

module.exports = { exemploSimples };
