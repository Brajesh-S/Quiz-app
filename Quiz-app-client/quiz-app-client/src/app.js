import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard";
import QuestionPage from "./questionPage";
import ResultPage from "./resultPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/questions/:quizId" element={<QuestionPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
