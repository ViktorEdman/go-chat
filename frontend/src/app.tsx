import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";

export function App() {

  return (
    <div className="container mx-auto py-4">
      <header className="text-3xl font-mono font-semibold px-4 py-4">Viktor Edman</header>
      <Navbar />
      <LandingPage />
    </div>
  )
}
