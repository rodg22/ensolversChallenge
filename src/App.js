import React from "react";
import MyNotes from "./components/MyNotes";
import ArchivedNotes from "./components/ArchivedNotes";
import { LoginScreen } from "./components/auth/LoginScreen";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="container mt-5">
        <Routes>
          <Route exact path="/" element={<LoginScreen />} />
          <Route exact path="/mynotes" element={<MyNotes />} />
          <Route exact path="/archivednotes" element={<ArchivedNotes />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
