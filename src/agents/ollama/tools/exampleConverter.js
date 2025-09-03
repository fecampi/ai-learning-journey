/**
 * Exemplo de como converter a resposta da IA em chamadas de função
 */

const { ToolManager } = require('./ToolManager');

// Criar ToolManager e adicionar tools
const toolManager = new ToolManager();

toolManager.addTool({
  name: "getLogs",
  description: "Busca logs de uma sessão",
  parameters: {
    type: "object",
    properties: {
      sessionId: { type: "integer", description: "ID da sessão" }
    },
    required: ["sessionId"]
  }
});

// Exemplo da resposta da IA que você recebeu
const aiResponse = `\`\`\`json
{
  "function_name": "getLogs",
  "arguments": {
    "sessionId": 101
  }
}
\`\`\``;

console.log("🤖 RESPOSTA DA IA:");
console.log(aiResponse);

console.log("\n🔍 PARSING DA RESPOSTA:");
const parseResult = toolManager.parseFunctionCalls(aiResponse);
console.log("Success:", parseResult.success);
console.log("Function calls encontradas:", parseResult.functionCalls.length);
console.log("Chamadas válidas:", parseResult.validCalls.length);

if (parseResult.success) {
  parseResult.functionCalls.forEach((call, index) => {
    console.log(`\nChamada ${index + 1}:`);
    console.log("- Função:", call.function_name);
    console.log("- Argumentos:", JSON.stringify(call.arguments));
    console.log("- É válida:", call.isValid ? "✅" : "❌");
  });
}

console.log("\n⚡ CONVERSÃO PARA EXECUÇÃO:");
const executableCalls = toolManager.convertToExecutableCalls(aiResponse);
console.log("Chamadas executáveis:", executableCalls);

// Exemplo de como executar
if (executableCalls.length > 0) {
  executableCalls.forEach((call, index) => {
    console.log(`\nExecutando chamada ${index + 1}:`);
    console.log(`Função: ${call.functionName}`);
    console.log(`Argumentos: ${JSON.stringify(call.arguments)}`);
    
    // Aqui você executaria a função real
    // Exemplo: await yourFunctionMap[call.functionName](call.arguments);
  });
}

module.exports = { toolManager };
