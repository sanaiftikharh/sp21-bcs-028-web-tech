import React from "react";
import NavBar from "./components/layout/NavBar";
import StitchedList from "./components/screens/StitchedList";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./components/screens/LandingPage";
function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <div className="container">
          <Routes>
            {/* <Route path="/login" element={<Login />} />
            <Route path="/" element={<HomePage />} /> */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/stitched" element={<StitchedList />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
