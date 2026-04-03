import { useEffect, useState } from "react";
import { Bounce, ClickSpark, StarBorder } from "@appletosolutions/reactbits";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function App() {
  const [health, setHealth] = useState("Loading backend status...");
  const [operations, setOperations] = useState([]);
  const [projectInfo, setProjectInfo] = useState(null);

  useEffect(() => {
    async function loadBootstrapData() {
      try {
        const [healthResponse, operationsResponse, infoResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/health`),
          fetch(`${API_BASE_URL}/api/operations`),
          fetch(`${API_BASE_URL}/api/project-info`),
        ]);

        const healthData = await healthResponse.json();
        const operationsData = await operationsResponse.json();
        const infoData = await infoResponse.json();

        setHealth(healthData.message);
        setOperations(operationsData.operations);
        setProjectInfo(infoData);
      } catch (error) {
        setHealth("Backend is unreachable. Start FastAPI on port 8000.");
      }
    }

    loadBootstrapData();
  }, []);

  return (
    <div className="app-shell">
      <header className="hero">
        <Bounce>
          <p className="eyebrow">Phase 0 Setup</p>
        </Bounce>
        <Bounce>
          <h1>Multitape Turing Machine Counter Simulator</h1>
        </Bounce>
        <Bounce>
          <p className="lead">
            FastAPI powers the simulator backend. React and Vite provide the web client
            that will later visualize tape execution step by step.
          </p>
        </Bounce>
      </header>

      <main className="grid">
        <StarBorder
          className="card-shell"
          color="#102033"
          speed="4s"
          style={{ borderRadius: "24px" }}
        >
          <section className="card">
            <h2>Backend Status</h2>
            <p>{health}</p>
          </section>
        </StarBorder>

        <StarBorder
          className="card-shell"
          color="#35607d"
          speed="5s"
          style={{ borderRadius: "24px" }}
        >
          <section className="card">
            <h2>Current Operations</h2>
            <ul className="chip-list">
              {operations.map((operation) => (
                <li key={operation}>{operation}</li>
              ))}
            </ul>
          </section>
        </StarBorder>

        <ClickSpark sparkColor="#35607d" sparkCount={10}>
          <StarBorder
            className="card-shell card-shell-wide"
            color="#7f4f24"
            speed="6s"
            style={{ borderRadius: "24px" }}
          >
            <section className="card card-wide">
              <h2>About The Project</h2>
              {projectInfo ? (
                <div className="about-block">
                  <p>
                    <strong>Developer:</strong> {projectInfo.developer}
                  </p>
                  <p>
                    <strong>Course:</strong> {projectInfo.course}
                  </p>
                  <p>
                    <strong>Program:</strong> {projectInfo.program}
                  </p>
                  <p>
                    <strong>Division:</strong> {projectInfo.division}
                  </p>
                  <p>
                    <strong>College:</strong> {projectInfo.college}
                  </p>
                  <p>
                    <strong>University:</strong> {projectInfo.university}
                  </p>
                </div>
              ) : (
                <p>Project metadata will appear here once the backend responds.</p>
              )}
            </section>
          </StarBorder>
        </ClickSpark>
      </main>
    </div>
  );
}
