import "./App.css";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import ExtinguisherPlan from "./components/ExtinguisherPlan";
import HosereelPlan from "./components/HosereelPlan";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />}>
          <Route path="extinguisher-plan" element={<ExtinguisherPlan />} />
          <Route path="hosereel-plan" element={<HosereelPlan />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
