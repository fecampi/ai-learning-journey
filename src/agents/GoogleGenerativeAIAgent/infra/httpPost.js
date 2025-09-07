const http = require("http");

function post(options, data, onChunk) {
  const opts = {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };
  return new Promise((resolve, reject) => {
    const req = http.request(opts, (res) => {
      let responseData = "";
      res.on("data", (chunk) => {
        if (onChunk) onChunk(chunk.toString());
        responseData += chunk;
      });
      res.on("end", () => {
        resolve(responseData);
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

module.exports = { post };
