import { Route, Switch, useLocation, Redirect } from "wouter-preact";
import LandingPage from "../pages/LandingPage";
import AboutPage from "../pages/AboutPage";
import ChatPage from "../pages/ChatPage";

export default function Router() {
  const [location, setLocation] = useLocation();
  if (location === "/404") setLocation("/404")
  return (
    <>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/chat" component={ChatPage} />
        <Route>
          <Redirect to="/404" />
          <p>{location} not found!</p>
        </Route>
      </Switch>
    </>
  );
}
