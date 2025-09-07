// Função utilitária para extrair texto e candidate da resposta Gemini
function getTextAndCandidateFromResponse(response, historyService) {
  let text;
  const candidate =
    response &&
    response.candidates &&
    response.candidates[0] &&
    response.candidates[0].content
      ? response.candidates[0].content
      : null;
  if (
    candidate &&
    candidate.parts &&
    candidate.parts[0] &&
    candidate.parts[0].text
  ) {
    text = candidate.parts[0].text;
  } else if (response && response.error && response.error.message) {
    text = response.error.message;
  } else {
    text = "Sem resposta do modelo";
  }
  if (historyService) {
    historyService.add("assistant", text);
  }
  return { text, candidate };
}

function getCallsFromResponse(candidate) {
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

module.exports = { getTextAndCandidateFromResponse, getCallsFromResponse };
