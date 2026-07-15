import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

function Home() {
  const [count, setCount] = useState(0);
  return (
    <section>
      <h2>Home</h2>
      <p>Client-side state works — counter proves React is hydrated:</p>
      <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>
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
