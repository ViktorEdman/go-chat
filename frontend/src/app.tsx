import Router from "./components/Router";

export function App() {
  // TODO: Global state for chat application
  // Zustand?

  return (
    <div className="container mx-auto py-4">
      <header className="text-3xl font-mono font-semibold px-4 py-4">Viktor Edman</header>
      <Router />
    </div>
  )
}
