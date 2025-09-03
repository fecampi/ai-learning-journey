# Ollama Gemma3 Agent

Este diretório contém o agente Node.js para interação com o modelo `gemma3:270m` via API Ollama.

## Arquivos
- `ollamaGemma3.js`: Classe que faz requisições para o modelo Gemma3.
- `README.md`: Este arquivo.

## Campos da resposta da API
A resposta da API Ollama para o modelo Gemma3 possui os seguintes campos principais:

- **model**: Nome do modelo utilizado (ex: `gemma3:270m`).
- **created_at**: Data e hora em que a resposta foi gerada.
- **response**: Texto gerado pelo modelo, ou seja, a resposta à sua pergunta.
- **done**: Indica se a geração da resposta foi concluída (`true` ou `false`).
- **done_reason**: Motivo pelo qual a geração terminou (ex: `stop`).
- **context**: Array de números inteiros (tokens) que representam o texto processado pelo modelo. Cada número corresponde a uma palavra, parte de palavra ou símbolo no vocabulário do modelo. Este campo é usado internamente pelo modelo e normalmente pode ser ignorado pelo usuário final.

## Exemplo de resposta
```json
{
  "model": "gemma3:270m",
  "created_at": "2025-09-01T23:44:22.332668934Z",
  "response": "Olá! Sou um modelo de linguagem grande, treinado pelo Google.\n",
  "done": true,
  "done_reason": "stop",
  "context": [105, 2364, 107, ...]
}
```


## Como rodar o modelo manualmente

Para interagir diretamente com o modelo Gemma3 via terminal, use:

```sh
ollama run gemma3:270m
```

Você verá:
```
>>> Send a message (/? for help)
```
Digite sua mensagem e o modelo irá responder.

## Como usar via Node.js
Veja o arquivo `demoOllamaGemma3.js` para um exemplo de uso programático.

---
Dúvidas ou sugestões? Edite este README ou abra uma issue!
