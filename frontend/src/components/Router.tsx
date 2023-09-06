import { Route, Switch, useLocation } from "wouter-preact";
import LandingPage from "../pages/LandingPage";
import AboutPage from "../pages/AboutPage";
import ChatPage from "../pages/ChatPage";

export default function Router() {
  const [location] = useLocation();
  return (
    <>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/chat" component={ChatPage} />
        <Route>
          <p>{location} not found!</p>
        </Route>
      </Switch>
    </>
  );
}
