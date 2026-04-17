import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import NewTask from "./pages/NewTask.jsx";
import TaskList from "../components/TaskList.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TaskList />} />
          <Route path="/new" element={<NewTask />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
