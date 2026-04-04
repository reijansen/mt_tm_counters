const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://127.0.0.1:8000";

function formatValidationDetails(detail) {
  if (!Array.isArray(detail) || detail.length === 0) {
    return "Please review the selected operation and input values, then try again.";
  }

  const firstIssue = detail[0];
  const fieldPath = Array.isArray(firstIssue?.loc) ? firstIssue.loc.join(" > ") : "input";
  const issueMessage = firstIssue?.msg ?? "Invalid input.";
  return `Please check ${fieldPath}: ${issueMessage}`;
}

function sanitizeMessage(message, fallbackMessage) {
  if (!message || typeof message !== "string") {
    return fallbackMessage;
  }

  return message
    .replace(/FastAPI/gi, "the simulator service")
    .replace(/backend/gi, "service")
    .replace(/\bqreject\b/gi, "the reject state");
}

function buildFriendlyError(response, data, fallbackMessage) {
  if (response.status === 422) {
    return formatValidationDetails(data?.detail);
  }

  if (response.status >= 500) {
    return "Something went wrong while processing the request. Please try again in a moment.";
  }

  if (response.status === 404) {
    return "The requested simulator resource could not be found.";
  }

  if (response.status === 400) {
    return sanitizeMessage(
      data?.detail,
      "The simulation input could not be processed. Please review the values and try again.",
    );
  }

  return sanitizeMessage(data?.detail, fallbackMessage);
}

async function parseJsonResponse(response, fallbackMessage = "The request could not be completed.") {
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(buildFriendlyError(response, data, fallbackMessage));
  }
  return data;
}

export async function fetchHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return parseJsonResponse(response, "The simulator service is currently unavailable.");
  } catch (error) {
    throw new Error("The simulator service is currently unavailable.");
  }
}

export async function fetchOperations() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/operations`);
    return parseJsonResponse(response, "The list of operations could not be loaded.");
  } catch {
    throw new Error("The list of operations could not be loaded.");
  }
}

export async function fetchProjectInfo() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/project-info`);
    return parseJsonResponse(response, "The project information could not be loaded.");
  } catch {
    throw new Error("The project information could not be loaded.");
  }
}

export async function runSimulation(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/simulations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return parseJsonResponse(
      response,
      "The simulation could not be run. Please review the values and try again.",
    );
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("The simulation could not be run. Please try again.");
  }
}
