const GoogleGemini = require("../../src/agents/GoogleGemini");
const {
  logTools,
} = require("../../src/agents/GoogleGemini/tools/registry/logTools");
const LogDataProvider = require("../../src/providers/LogDataProvider");
const {loggerAssistent} = require("../../src/agents/GoogleGemini/config/prompts")

async function runDemo() {
  const agent = new GoogleGemini();
  agent.setSystemInstruction(loggerAssistent)
  agent.toolManager.addTool(logTools.getLogs,  LogDataProvider.getLogs);
  agent.toolManager.addTool(logTools.getAvailableSessions, LogDataProvider.getAvailableSessions);
  agent.toolManager.addTool(logTools.getDeviceModel, LogDataProvider.getDeviceModel);

  // agent.toolManager.removeTool("getDeviceModel")

  try {
    const resposta = await agent.generate();
    console.log("Resposta da API Google Gemini:");
    try {
      const obj = JSON.parse(resposta);
      console.dir(obj, { depth: null, colors: true });
    } catch {
      console.log(resposta);
    }
  } catch (error) {
    console.error("Erro ao acessar a API Ollama:", error);
  }
}

runDemo();
