const baseUrl = "http://127.0.0.1:8000/";

async function get(id: number, prompt: string, n: number = 1) {
  const encodedPrompt = encodeURIComponent(prompt);
  const response = await fetch(
    `${baseUrl}${id}?prompt=${encodedPrompt}&n=${n}`
  );
  const result = await response.json();
  console.log(result);

  return result[0] as string[];
}

async function post(id: number, name: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${baseUrl}${id}?name=${encodeURIComponent(name)}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();
  console.log(result);
  return result;
}

export { get, post };
