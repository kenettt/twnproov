import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Life from "./pages/GameOfLife";
import Article from "./pages/Article";
import List from "./pages/List";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/life" element={<Life />} />
          <Route path="/article" element={<Article />} />
          <Route path="/list" element={<List />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
