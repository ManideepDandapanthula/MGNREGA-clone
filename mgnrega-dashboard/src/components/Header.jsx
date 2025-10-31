import React from "react";
import { Navbar, Container } from "react-bootstrap";

export default function Header() {
  return (
    <Navbar bg="success" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>
          🌾 MGNREGA District Dashboard
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
