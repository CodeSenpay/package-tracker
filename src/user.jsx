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
import Stepper from "./components/stepper";
import "./css/user.css";
import {
  getTransaction,
  loadPackagesByAssigned,
  loadPackagesByEmail,
  sendDataToAPI,
} from "./helpers";
import { useUserContext } from "./usercontext";

function UserDashboard() {
  const { user } = useUserContext();
  const [packages, setPackages] = useState();
  const [incomingpackage, setIncomingPackage] = useState();
  const [completedpackages, setCompletedPackages] = useState();
  const [transactioninfo, setTransactioninfo] = useState();
  const [statedescription, setStateDescription] = useState();
  const [statestatus, setStateStatus] = useState();
  const [lgShowIncoming, setLgShowIncoming] = useState(false);
  const [lgShowCompleted, setLgShowCompleted] = useState(false);

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
    try {
      const response = await loadPackagesByEmail(user["email"]);
      const result = await response.json();
      setPackages(result[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const getIncoming = async () => {
    try {
      const response = await loadPackagesByAssigned(user["email"]);
      const result = await response.json();
      setIncomingPackage(result[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getCompleted = async () => {
    const data = {
      transactiontype: "Delivered",
      spname: "load_packagebytransactiontype",
    };

    try {
      const response = await sendDataToAPI(data);
      const result = await response.json();

      setCompletedPackages(result);
    } catch (error) {
      console.error("Error: " + error);
    }
  };
  const notifysuccess = (data) => {
    toast.success(data);
  };
  const notifyfailed = (data) => {
    toast.error(data);
  };

  const RejectPackage = async (data) => {
    const modifiedData = {
      ...data,
      spname: "update_packagestate",
    };

    console.log(modifiedData);

    const response = await sendDataToAPI(modifiedData);
    const result = await response.json();

    if (result[0][0].statuscode == 1) {
      getIncoming();
      notifyfailed("Package Rejected");
    } else {
      console.log(result[0][0]);
    }
  };

  const AcceptPackage = async (data) => {
    const modifiedData = {
      ...data,
      spname: "update_packagestate",
    };

    console.log(modifiedData);

    const response = await sendDataToAPI(modifiedData);
    const result = await response.json();
    console.log(result[0][0]);

    if (result[0][0].statuscode == 1) {
      getIncoming();
      notifysuccess("Package Accepted");
    } else {
      console.log(result[0][0]);
    }
  };

  useEffect(() => {
    document.title = "User";
    console.log("Outside");
    const fetchData = async () => {
      fetchPackagesViaEmail();
      getIncoming();
      getCompleted();
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
            <div
              style={{
                flex: "1",
                display: "flex",
                justifyContent: "start",
                gap: "20px",
              }}
            >
              <Button
                variant="success"
                onClick={() => {
                  setLgShowCompleted(true);
                }}
              >
                Completed
              </Button>
              <Button
                variant="warning"
                onClick={() => {
                  setLgShowCompleted(true);
                }}
              >
                <Link
                  to="/history"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  History
                </Link>
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setLgShowIncoming(true);
                }}
              >
                Incoming{" "}
                <Badge bg="danger">
                  {incomingpackage == undefined
                    ? 0
                    : incomingpackage[0]["statuscode"] == 0
                    ? 0
                    : incomingpackage?.length}
                </Badge>
              </Button>
            </div>
            <Button variant="warning">
              <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                Log Out
              </Link>
            </Button>
          </Nav>
        </Container>
      </Navbar>
      <div className="userdashboard">
        <div
          className="search-card"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <p
            style={{
              backgroundColor: "#314051",
              padding: "15px",
              borderRadius: "50px",
              color: "white",
              fontSize: "2.5rem",
              fontWeight: "bolder",
            }}
          >
            Welcome {user?.name}
          </p>
        </div>
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
                  onClick={async () => {
                    await getTransactionDetail(pack.transactiontype);
                  }}
                >
                  {pack?.package_id} : {pack?.packagename}
                  <Badge
                    bg={
                      pack.transactiontype == "Package Set"
                        ? "warning"
                        : pack.transactiontype == "In transit"
                        ? "primary"
                        : "success"
                    }
                  >
                    {pack.transactiontype}
                  </Badge>
                </Accordion.Header>
                <Accordion.Body>
                  <Stepper
                    packInfo={pack}
                    transacInfo={transactioninfo}
                    description={statedescription}
                    statestatus={statestatus}
                  />
                </Accordion.Body>
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
        show={lgShowIncoming}
        onHide={() => setLgShowIncoming(false)}
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
          {incomingpackage?.map((pack, index) => {
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
          })}
        </Modal.Body>
      </Modal>
      <Modal
        size="lg"
        show={lgShowCompleted}
        onHide={() => setLgShowCompleted(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton style={{ backgroundColor: "#314051" }}>
          <Modal.Title style={{ color: "white" }}>Completed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {completedpackages == undefined ? (
            <h1></h1>
          ) : (
            completedpackages[0].map((pack, index) => {
              return pack.statuscode == 0 ? (
                <div></div>
              ) : pack.senderemail == user.email ? (
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
                      <Badge
                        bg={pack?.received == "true" ? "success" : "danger"}
                      >
                        {pack?.received == "true" ? "Accepted" : "Rejected"}
                      </Badge>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>Package Description: {pack?.packagedescription}</p>
                      <p>Sender: {pack?.supplier}</p>
                      <p>Sender Address: {pack?.supplieraddress}</p>
                      <p>Receiver: {pack?.orderby}</p>
                      <p>Receiver Address: {pack?.customeraddress}</p>
                      <p>Email: {pack.senderemail}</p>
                      <div style={{ display: "flex", gap: "10px" }}></div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ) : (
                <div></div>
              );
            })
          )}
        </Modal.Body>
      </Modal>
      <ToastContainer autoClose={3000} />
    </>
  );
}

export default UserDashboard;
