# Padrão de Arquitetura para Ferramentas de IA

## 📋 Visão Geral
Este documento define o padrão padronizado para ferramentas (tools) que uma IA deve retornar e como elas devem ser estruturadas no sistema.

## 🏗️ Arquitetura de Ferramentas

### Estrutura Base de uma Tool

```javascript
{
  name: "nomeFunction",
  description: "Descrição clara do que a função faz",
  parameters: {
    type: "object",
    properties: {
      parametro1: {
        type: "string|integer|boolean|array|object",
        description: "Descrição do parâmetro"
      },
      parametro2: {
        type: "integer",
        description: "Outro parâmetro"
      }
    },
    required: ["parametro1"] // Array com parâmetros obrigatórios
  }
}
```

## 🎯 Padrões por Tipo de Dados

### 1. Parâmetros String
```javascript
{
  name: "searchLogs",
  description: "Busca logs por palavra-chave",
  parameters: {
    type: "object",
    properties: {
      keyword: {
        type: "string",
        description: "Palavra-chave para buscar nos logs"
      }
    },
    required: ["keyword"]
  }
}
```

### 2. Parâmetros Integer
```javascript
{
  name: "getLogs",
  description: "Busca logs de uma sessão específica pelo ID",
  parameters: {
    type: "object",
    properties: {
      sessionId: {
        type: "integer",
        description: "ID da sessão (101, 102, ou 103)"
      }
    },
    required: ["sessionId"]
  }
}
```

### 3. Parâmetros Boolean
```javascript
{
  name: "getSystemStatus",
  description: "Obtém status do sistema",
  parameters: {
    type: "object",
    properties: {
      detailed: {
        type: "boolean",
        description: "Se true, retorna informações detalhadas"
      }
    },
    required: []
  }
}
```

### 4. Sem Parâmetros
```javascript
{
  name: "getCurrentTime",
  description: "Obtém a data e hora atual",
  parameters: {
    type: "object",
    properties: {},
    required: []
  }
}
```

### 5. Múltiplos Parâmetros
```javascript
{
  name: "calculate",
  description: "Realiza cálculos matemáticos",
  parameters: {
    type: "object",
    properties: {
      operation: {
        type: "string",
        description: "Operação: add, subtract, multiply, divide"
      },
      a: {
        type: "number",
        description: "Primeiro número"
      },
      b: {
        type: "number",
        description: "Segundo número"
      }
    },
    required: ["operation", "a", "b"]
  }
}
```

## 📁 Organização em Registry

### Estrutura de Registry
```javascript
// /tools/registry/logTools.js
const logTools = {
  getLogs: {
    name: "getLogs",
    description: "Busca logs de uma sessão",
    parameters: { /* ... */ }
  },
  
  searchLogs: {
    name: "searchLogs", 
    description: "Busca logs por palavra-chave",
    parameters: { /* ... */ }
  }
};

module.exports = { logTools };
```

## 🔧 Como o ToolManager Processa

### 1. Adição Individual
```javascript
const agent = new OllamaGemma3Agent();
agent.addTool({
  name: "exemplo",
  description: "Função de exemplo",
  parameters: {
    type: "object",
    properties: {
      input: { type: "string", description: "Entrada" }
    },
    required: ["input"]
  }
});
```

### 2. Adição em Lote (Array)
```javascript
const tools = [
  { name: "tool1", /* ... */ },
  { name: "tool2", /* ... */ }
];
agent.addTools(tools);
```

### 3. Adição em Lote (Objeto)
```javascript
const tools = {
  tool1: { name: "tool1", /* ... */ },
  tool2: { name: "tool2", /* ... */ }
};
agent.addTools(tools);
```

## 📤 Formato de Saída do ToolManager

O `ToolManager.getTools()` gera automaticamente:

```markdown
**FERRAMENTAS DISPONÍVEIS:**

### 1. getLogs
**Descrição:** Busca logs de uma sessão específica pelo ID

**Parâmetros esperados:**
- sessionId (integer) – ID da sessão (101, 102, ou 103)

**Parâmetros obrigatórios:** sessionId

**Exemplo de uso:**

```json
{
  "sessionId": 101
}
```

---
```

## 🎯 Exemplos Automaticamente Gerados

O sistema gera exemplos automáticos baseados no tipo:

| Tipo | Exemplo Gerado |
|------|----------------|
| `string` | `"exemplo"` |
| `integer` | `101` |
| `boolean` | `true` |
| `number` | `101` |
| Outros | `null` |

## 🔄 Fluxo de Processamento

1. **IA Retorna Tool** → Estrutura JSON padronizada
2. **ToolManager.addTool()** → Valida e armazena
3. **ToolManager.getTools()** → Gera documentação formatada
4. **Agente** → Envia documentação para IA como contexto
5. **IA** → Usa tools baseada na documentação

## ✅ Boas Práticas

### ✅ DO (Faça)
- Use nomes descritivos para funções
- Inclua descrições claras e específicas
- Defina tipos corretos para parâmetros
- Liste parâmetros obrigatórios em `required`
- Use convenções consistentes de nomenclatura

### ❌ DON'T (Não Faça)
- Criar nomes ambíguos
- Omitir descrições de parâmetros
- Misturar tipos de dados incorretos
- Esquecer de definir `required`
- Usar estruturas inconsistentes

## 🧪 Exemplos Completos

### Tool Simples
```javascript
{
  name: "ping",
  description: "Testa conectividade",
  parameters: {
    type: "object",
    properties: {},
    required: []
  }
}
```

### Tool Complexa
```javascript
{
  name: "generateReport",
  description: "Gera relatório baseado em filtros",
  parameters: {
    type: "object", 
    properties: {
      startDate: {
        type: "string",
        description: "Data inicial no formato YYYY-MM-DD"
      },
      endDate: {
        type: "string", 
        description: "Data final no formato YYYY-MM-DD"
      },
      category: {
        type: "string",
        description: "Categoria do relatório: errors, warnings, info"
      },
      limit: {
        type: "integer",
        description: "Número máximo de registros (padrão: 100)"
      }
    },
    required: ["startDate", "endDate", "category"]
  }
}
```

## 🔗 Integração com Diferentes Agentes

### Ollama Agent
```javascript
const agent = new OllamaGemma3Agent();
agent.addTool(toolDefinition);
```

### Google Generative AI Agent  
```javascript
const agent = new GoogleGenerativeAIAgent(apiKey);
agent.addTool(toolDefinition, implementation);
```

### CrewAI Pattern
```javascript
const crew = new OllamaCrew();
crew.addTool(toolDefinition, implementation);
```

Este padrão garante consistência, documentação automática e fácil integração entre diferentes tipos de agentes de IA.
