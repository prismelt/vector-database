const baseUrl = "http://127.0.0.1:8000/";

async function get(id: number, prompt: string, n: number = 1) {
  const encodedPrompt = encodeURIComponent(prompt);
  const response = await fetch(
    `${baseUrl}${id}?prompt=${encodedPrompt}&n=${n}`
  );
  const result = await response.json();
  console.log(result);

  return result["ids"];
}

async function post(id: number, name: string, data: string) {
  const response = await fetch(`${baseUrl}${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      data: data,
    }),
  });
  const result = await response.json();
  console.log(result);
  return result;
}

export { get, post };
