import { useEffect, useState } from "react";
import {
  Accordion,
  Badge,
  Button,
  Container,
  Modal,
  Nav,
  Navbar,
} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./css/user.css";
import { getTransaction, sendDataToAPI } from "./helpers";
import { useUserContext } from "./usercontext";

function History() {
  const { user } = useUserContext();
  const [packages, setPackages] = useState();
  const [packageHistory, setPackageHistory] = useState();
  const [lgShowHistory, setLgShowHistory] = useState(false);

  async function getTransactionDetail(transactype) {
    try {
      const response = await getTransaction(transactype);
      const result = await response.json();

      if (result[0][0].statuscode == 1) {
        setTransactioninfo(result[0][0]);
        setStateDescription(result[0][0].statedescription.split("|"));
        setStateStatus(Array.from(String(result[0][0].statestatus), Number));
        console.log(result[0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchPackagesViaEmail() {
    const data = {
      email: user.email,
      spname: "loadHistory",
    };
    try {
      const response = await sendDataToAPI(data);
      const result = await response.json();
      setPackages(result[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const notifysuccess = (data) => {
    toast.success(data);
  };
  const notifyfailed = (data) => {
    toast.error(data);
  };

  useEffect(() => {
    document.title = "History";
    const fetchData = async () => {
      fetchPackagesViaEmail();
    };

    const interval = setInterval(fetchData, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (user == undefined) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h4
          style={{
            backgroundColor: "#f94449",
            padding: "10px",
            borderRadius: "50px",
            color: "white",
          }}
        >
          You've refresh the page reason the data is lost, please log out and
          log in again thank you!
        </h4>
        <Button variant="danger" style={{ fontSize: "2rem" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Logout
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Navbar style={{ backgroundColor: "#314051" }}>
        <Container style={{ display: "flex" }}>
          <Navbar.Brand
            href="#"
            style={{
              color: "white",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              gap: "5px",
              flex: "1",
            }}
          >
            <Icon.GlobeCentralSouthAsia color="white" />
            Package Tracker
          </Navbar.Brand>
          <Nav
            className="me-auto"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Button variant="primary">
              <Link
                to="/userdashboard"
                style={{ textDecoration: "none", color: "white" }}
              >
                Dashboard
              </Link>
            </Button>
            <div
              style={{
                flex: "1",
                display: "flex",
                justifyContent: "start",
                gap: "20px",
              }}
            ></div>
            <Button variant="warning">
              <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                Log Out
              </Link>
            </Button>
          </Nav>
        </Container>
      </Navbar>
      <div className="userdashboard">
        {packages?.map((pack, index) => {
          return pack.statuscode == 0 ? (
            <div></div>
          ) : pack.transactiontype != "Delivered" ? (
            <Accordion
              style={{ padding: "20px", width: "50%", margin: "auto" }}
              defaultActiveKey="0"
            >
              <Accordion.Item eventKey={index}>
                <Accordion.Header
                  onClick={() => {
                    setLgShowHistory(true);
                  }}
                >
                  {pack?.package_id} : {pack?.packagename}
                  <Badge bg="success">History</Badge>
                </Accordion.Header>
              </Accordion.Item>
            </Accordion>
          ) : (
            <div>
              <h1></h1>
            </div>
          );
        })}
      </div>

      <Modal
        size="lg"
        show={lgShowHistory}
        onHide={() => setLgShowHistory(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton style={{ backgroundColor: "#314051" }}>
          <Modal.Title
            id="example-modal-sizes-title-lg"
            style={{ color: "white" }}
          >
            Incoming Packages
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto" }}>
          {/* {incomingpackage?.map((pack, index) => {
            return pack.statuscode == 0 ? (
              <div></div>
            ) : (
              <Accordion
                style={{ padding: "20px", width: "80%", margin: "auto" }}
                defaultActiveKey="0"
              >
                <Accordion.Item eventKey={index}>
                  <Accordion.Header
                    onClick={async () => {
                      await getTransactionDetail(pack.transactiontype);
                    }}
                  >
                    {pack?.package_id} : {pack?.packagename}
                  </Accordion.Header>
                  <Accordion.Body>
                    <p>Package Description: {pack?.packagedescription}</p>
                    <p>Sender: {pack?.supplier}</p>
                    <p>Sender Address: {pack?.supplieraddress}</p>
                    <p>Receiver: {pack?.orderby}</p>
                    <p>Receiver Address: {pack?.customeraddress}</p>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Button
                        variant="success"
                        onClick={async () => {
                          const data = {
                            package_id: pack.package_id,
                            transactiontype: "Delivered",
                            statevalue: "1",
                            statedescription: "Package Accepted",
                            packagename: pack.packagename,
                            received: "true",
                            assigned: "none",
                            senderemail: pack.senderemail,
                            receiveremail: pack.receiveremail,
                          };
                          await AcceptPackage(data);
                          await getIncoming();
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        onClick={async () => {
                          const data = {
                            package_id: pack.package_id,
                            transactiontype: "Delivered",
                            statevalue: "2",
                            statedescription: "Package Rejected",
                            packagename: pack.packagename,
                            received: "rejected",
                            assigned: "none",
                            senderemail: pack.senderemail,
                            receiveremail: pack.receiveremail,
                          };
                          await RejectPackage(data);
                          await getIncoming();
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            );
          })} */}
        </Modal.Body>
      </Modal>

      <ToastContainer autoClose={3000} />
    </>
  );
}

export default History;
