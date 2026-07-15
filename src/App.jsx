import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

// Fetches this app's runtime config from Praxsuite (resolved by subdomain), the same way a
// real shell would. Proves the manifest (praxsuite.app.json) → Data tab → runtime-config loop.
function useRuntimeConfig() {
  const [state, setState] = useState({ status: "loading", config: null });
  useEffect(() => {
    const base = import.meta.env.VITE_PRAXSUITE_CONFIG_BASE || "https://api.praxsuite.com";
    const host = window.location.hostname;
    const subdomain = host.split(".")[0];
    if (!subdomain || host === "localhost" || host.startsWith("127.")) {
      setState({ status: "local", config: null });
      return;
    }
    fetch(`${base}/api/v1/appruntimeconfig/public/${subdomain}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => setState({ status: "ok", config: j?.result ?? j?.data ?? j }))
      .catch(() => setState({ status: "none", config: null }));
  }, []);
  return state;
}

function Home() {
  const [count, setCount] = useState(0);
  const { status, config } = useRuntimeConfig();
  return (
    <section>
      <h2>Home</h2>
      <p>Client-side state works — counter proves React is hydrated:</p>
      <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>

      <h3 style={{ marginTop: "1.5rem" }}>Runtime config</h3>
      {status === "loading" && <p className="path">Loading…</p>}
      {status === "local" && <p className="path">Local dev — runtime config skipped.</p>}
      {status === "none" && <p className="path">No runtime config set for this app yet (configure it in the Data tab).</p>}
      {status === "ok" && config && (
        <pre style={{ background: "#1e293b", padding: "0.75rem", borderRadius: 8, overflowX: "auto", fontSize: "0.8rem" }}>
          {JSON.stringify(
            { workspaceId: config.workspaceId, gatewayUrl: config.gatewayUrl, tables: config.tables },
            null,
            2
          )}
        </pre>
      )}
    </section>
  );
}

function About() {
  return (
    <section>
      <h2>About</h2>
      <p>
        This route lives at <code>/about</code>. Loading it directly (a hard refresh)
        exercises the Sites Worker's SPA fallback — the server has no <code>/about</code>
        file, so it must serve <code>index.html</code> and let React Router render this page.
      </p>
    </section>
  );
}

export default function App() {
  const { pathname } = useLocation();
  return (
    <main>
      <h1>Praxsuite React Test</h1>
      <p className="badge">Deployed via git-clone → Praxsuite hosting</p>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <p className="path">Current path: <code>{pathname}</code></p>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<section><h2>404</h2><p>No route matched.</p></section>} />
      </Routes>
    </main>
  );
}
