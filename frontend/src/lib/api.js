const API_BASE_URL = "http://127.0.0.1:8000";

async function parseJsonResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    const message = data?.detail ?? "Request failed.";
    throw new Error(message);
  }
  return data;
}

export async function fetchHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  return parseJsonResponse(response);
}

export async function fetchOperations() {
  const response = await fetch(`${API_BASE_URL}/api/operations`);
  return parseJsonResponse(response);
}

export async function fetchProjectInfo() {
  const response = await fetch(`${API_BASE_URL}/api/project-info`);
  return parseJsonResponse(response);
}

export async function runSimulation(payload) {
  const response = await fetch(`${API_BASE_URL}/api/simulations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return parseJsonResponse(response);
}

