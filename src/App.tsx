import { Route, Routes } from "react-router-dom";
import { SignUp } from "./pages/sign-up";
import { Home } from "./pages/home";

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
