import "./App.css";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import ExtinguisherPlan from "./components/ExtinguisherPlan";
import HosereelPlan from "./components/HosereelPlan";
import { ResultContextProvider } from "./contexts/ResultContext";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <div className="App">
      <ResultContextProvider>
        <Routes>
          <Route path="/index.html" element={<Landing />}>
            <Route path="/index.html/extinguisher-plan" element={<ExtinguisherPlan />} />
            <Route path="/index.html/hosereel-plan" element={<HosereelPlan />} />
          </Route>
          <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
        </Routes>
      </ResultContextProvider>
    </div>
  );
};

export default App;
