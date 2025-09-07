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
    this.tools = [{ function_declarations: [] }];
    this.functionRefs = [];
  }

  addTool(tool, fnRef) {
    console.log("Adicionando ferramenta:", tool, fnRef);
    if (tool && tool.name && tool.parameters) {
      this.tools[0].function_declarations.push(tool);
      if (fnRef && typeof fnRef === "function") {
        this.functionRefs.push({ name: tool.name, fn: fnRef });
      }
    }
    console.log("Ferramentas atuais:", JSON.stringify(this.tools, null, 2));
    console.log(
      "Chamadas de função atuais:",
      JSON.stringify(this.functionRefs, null, 2)
    );
  }

  removeTool(functionName) {
    if (!this.tools.length) return false;
    const original = this.tools[0].function_declarations.length;
    this.tools[0].function_declarations =
      this.tools[0].function_declarations.filter(
        (func) => func.name !== functionName
      );
    return this.tools[0].function_declarations.length < original;
  }

  /**
   * Executa uma função registrada em functionRefs pelo nome
   * @param {{ name: string, args: any }} param0
   * @returns {any} resultado da função ou undefined se não encontrada
   */
  executeFunctionByName({ name, args }) {
    if (!this.functionRefs) return "Sem funções registradas";
    const ref = this.functionRefs.find((f) => f.name === name);
    if (ref && typeof ref.fn === "function") {
      if (Array.isArray(args)) {
        return ref.fn(...args);
      } else if (args && typeof args === "object") {
        return ref.fn(...Object.values(args));
      } else {
        return ref.fn(args);
      }
    }
    return "Sem dados de funções executadas";
  }

  executeFunctions(calls) {
    if (!Array.isArray(calls) || calls.length === 0) return null;
    const results = calls.map(call => ({
      name: call.name,
      result: this.executeFunctionByName(call)
    }));
    if (results.length === 0) return null;
    return results
      .map(({ name, result }) => `Resultado de ${name}: ${JSON.stringify(result)}`)
      .join('\n');
  }

  getTools() {
    return this.tools;
  }
}

module.exports = { ToolManager };
