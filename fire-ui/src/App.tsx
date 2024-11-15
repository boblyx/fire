import "./App.css";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import ExtinguisherPlan from "./components/ExtinguisherPlan";
import HosereelPlan from "./components/HosereelPlan";
import { ResultContextProvider } from "./contexts/ResultContext";
//import NotFound from "./pages/NotFound";

//{/*<Route path="*" element={<NotFound />} /> {/* Catch-all route */*/}
const App = () => {
  return (
    <div className="App">
      <ResultContextProvider>
        <Routes>
          <Route path="/" element={<Landing />}>
            <Route path="/extinguisher-plan" element={<ExtinguisherPlan />} />
            <Route path="/hosereel-plan" element={<HosereelPlan />} />
          </Route>
        </Routes>
      </ResultContextProvider>
    </div>
  );
};

export default App;
