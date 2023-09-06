import Router from "./components/Router";
import Navbar from "./components/Navbar";

export function App() {


  return (
    <div className="container mx-auto py-4">
      <header className="text-3xl font-mono font-semibold ">Viktor Edman</header>
      <Navbar />
      <Router />
    </div>
  )
}
