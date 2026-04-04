import { useEffect, useState } from "react";

import { fetchHealth, fetchOperations, fetchProjectInfo } from "../lib/api";

export default function useBootstrapData() {
  const [health, setHealth] = useState("Loading simulator status...");
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
        const message =
          error instanceof Error
            ? error.message
            : "The simulator service is currently unavailable.";
        setPageError(message);
        setHealth(message);
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
