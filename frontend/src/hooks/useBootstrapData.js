import { useEffect, useState } from "react";

import { fetchHealth, fetchOperations, fetchProjectInfo } from "../lib/api";

export default function useBootstrapData() {
  const [health, setHealth] = useState("Loading backend status...");
  const [operations, setOperations] = useState([]);
  const [projectInfo, setProjectInfo] = useState(null);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    async function loadBootstrapData() {
      try {
        const [healthData, operationsData, projectData] = await Promise.all([
          fetchHealth(),
          fetchOperations(),
          fetchProjectInfo(),
        ]);

        setHealth(healthData.message);
        setOperations(operationsData.operations);
        setProjectInfo(projectData);
      } catch (error) {
        setPageError("Backend is unreachable. Start FastAPI on port 8000.");
        setHealth("Backend is unreachable. Start FastAPI on port 8000.");
      }
    }

    loadBootstrapData();
  }, []);

  return {
    health,
    operations,
    projectInfo,
    pageError,
  };
}
