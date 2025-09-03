class ToolManager {
  constructor() {
    this.tools = [];
  }

  addTool(tool) {
    this.tools.push(tool);
  }

  addTools(tools) {
    if (Array.isArray(tools)) {
      // Se receber array de tools
      tools.forEach(tool => this.addTool(tool));
    } else if (typeof tools === 'object') {
      // Se receber objeto com tools (como logTools)
      Object.values(tools).forEach(tool => this.addTool(tool));
    } else {
      throw new Error('addTools espera um array de tools ou um objeto contendo tools');
    }
  }

  getTools() {
    if (this.tools.length === 0) {
      return "Nenhuma ferramenta disponível.";
    }

    let fullDescription = "**FERRAMENTAS DISPONÍVEIS:**\n\n";
    

    this.tools.forEach((tool, index) => {
      fullDescription += `### ${index + 1}. ${tool.name}\n`;
      fullDescription += `**Descrição:** ${tool.description}\n\n`;

      if (tool.parameters && tool.parameters.properties) {
        fullDescription += "**Parâmetros esperados:**\n";

        const example = {};
        for (const [paramName, paramInfo] of Object.entries(tool.parameters.properties)) {
          fullDescription += `- ${paramName} (${paramInfo.type}) – ${paramInfo.description}\n`;

          // Gerar exemplo automático para parâmetros obrigatórios
          if (tool.parameters.required && tool.parameters.required.includes(paramName)) {
            switch (paramInfo.type) {
              case "integer":
                example[paramName] = 101;
                break;
              case "string":
                example[paramName] = "exemplo";
                break;
              case "boolean":
                example[paramName] = true;
                break;
              default:
                example[paramName] = null;
            }
          }
        }

        if (tool.parameters.required && tool.parameters.required.length > 0) {
          fullDescription += `\n**Parâmetros obrigatórios:** ${tool.parameters.required.join(", ")}\n`;
        }

        // Adicionar exemplo em JSON
        fullDescription += `\n**Exemplo de uso:**\n\n`;
        const functionCallExample = {
          function_name: tool.name,
          arguments: example
        };
        fullDescription += "```json\n" + JSON.stringify(functionCallExample, null, 2) + "\n```\n";
      }

      fullDescription += "\n---\n\n";
    });

    return fullDescription;
  }

  clearTools() {
    this.tools = [];
  }

  getToolsCount() {
    return this.tools.length;
  }

  /**
   * Extrai função da resposta da IA (versão simples)
   * @param {string} text - Resposta da IA
   * @returns {Object|null} { functionName, arguments } ou null
   */
  extractFunction(text) {
    try {
      // Pegar JSON entre ```json e ```
      const match = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      if (!match) return null;
      
      const parsed = JSON.parse(match[1]);
      
      if (parsed.function_name && parsed.arguments !== undefined) {
        return {
          functionName: parsed.function_name,
          arguments: parsed.arguments
        };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }
}

module.exports = { ToolManager };
