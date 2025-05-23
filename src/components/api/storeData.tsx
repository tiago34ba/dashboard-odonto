export async function storeData(endpoint: string, data: object) {
  const apiUrl = "http://127.0.0.1:8000/api"; // URL base da API Laravel
  try {
    const response = await fetch(`${apiUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erro ao armazenar dados: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao conectar com a API:", error);
    throw error;
  }
}


