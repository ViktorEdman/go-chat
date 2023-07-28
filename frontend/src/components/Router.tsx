import { Route } from "wouter-preact";
import Navbar from "./Navbar";
import LandingPage from "../pages/LandingPage";
import AboutPage from "../pages/AboutPage";

export default function Router() {
  return (
    <>
      <Navbar />
      <Route path="/" component={LandingPage} />
      <Route path="/about" component={AboutPage} />
    </>
  )

}
