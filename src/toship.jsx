import { Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
function ToShip() {
  return (
    <>
      <Navbar style={{ backgroundColor: "#6D2932" }}>
        <Container>
          <Navbar.Brand href="#" style={{ color: "white", fontWeight: "600" }}>
            Package Tracker
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link>
              <Link
                to="/intransit"
                style={{ color: "white", textDecoration: "none" }}
              >
                In Transit
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                to="/completed"
                style={{ color: "white", textDecoration: "none" }}
              >
                Completed
              </Link>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <h1>To Ship Page</h1>
      <Link to="/dashboard">Go Back</Link>
    </>
  );
}

export default ToShip;
