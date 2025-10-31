import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import { Container } from "react-bootstrap";

function App() {
  return (
    <>
      <Header />
      <Container className="mt-4">
        <Home />
      </Container>
    </>
  );
}

export default App;
