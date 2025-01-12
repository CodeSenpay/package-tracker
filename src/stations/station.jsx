import { useEffect, useState } from "react";
import {
  Accordion,
  Badge,
  Button,
  Container,
  Nav,
  Navbar,
} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "../css/station.css";
import {
  getTransaction,
  loadPackagesByAssigned,
  sendDataToAPI,
} from "../helpers";
import { useUserContext } from "../usercontext";
function Station() {
  const { user } = useUserContext();
  const [packages, setPackages] = useState();
  const [transactioninfo, setTransactioninfo] = useState();
  const [statedescription, setStateDescription] = useState([]);

  const fetchPackages = async () => {
    try {
      const response = await loadPackagesByAssigned(user["level"]);
      const result = await response.json();

      setPackages(result[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
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

  const notifysuccess = (data) => {
    toast.success(data);
  };

  const onApproved = async (data) => {
    const modifiedData = {
      ...data,
      spname: "update_packagestate",
    };

    console.log(modifiedData);

    const response = await sendDataToAPI(modifiedData);
    const result = await response.json();

    if (result[0][0].statuscode == 1) {
      fetchPackages();
      notifysuccess("Package has Arrived to the facility");
    } else {
      console.log(result[0][0]);
    }
  };

  const onDepart = async (data) => {
    const modifiedData = {
      ...data,
      spname: "update_packagestate",
    };

    console.log(modifiedData);

    const response = await sendDataToAPI(modifiedData);
    const result = await response.json();
    console.log(result[0][0]);

    if (result[0][0].statuscode == 1) {
      fetchPackages();
      notifysuccess("Package Departed from the facility");
    } else {
      console.log(result[0][0]);
    }
  };

  useEffect(() => {
    document.title = user?.name;
    getTransactionDetail("In transit");
    const interval = setInterval(() => {
      fetchPackages();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [packages]);

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
    <div>
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
          <Nav className="me-auto" style={{}}>
            <Button variant="warning">
              <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                Log Out
              </Link>
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <div className="stationheader">
        <p
          style={{
            backgroundColor: "#314051",
            padding: "15px",
            borderRadius: "50px",
            color: "white",
            marginTop: "10px",
            fontSize: "2.5rem",
            fontWeight: "bolder",
          }}
        >
          Welcome to {user?.name}
        </p>
      </div>
      <div className="stationbody">
        {packages?.map((pack, index) => {
          return pack.statuscode == 0 ? (
            <div></div>
          ) : (
            <Accordion
              style={{ padding: "20px", width: "50%", margin: "auto" }}
              defaultActiveKey="0"
            >
              <Accordion.Item eventKey={index}>
                <Accordion.Header>
                  {pack?.packagename} <Badge bg="primary">In Transit</Badge>
                </Accordion.Header>
                <Accordion.Body>
                  <p>Package Description: {pack?.packagedescription}</p>
                  <p>Sender: {pack?.supplier}</p>
                  <p>Sender Address: {pack?.supplieraddress}</p>
                  <p>Receiver: {pack?.orderby}</p>
                  <p>Receiver Address: {pack?.customeraddress}</p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                      variant="warning"
                      onClick={async () => {
                        const data = {
                          package_id: pack.package_id,
                          transactiontype: transactioninfo.transactiontype,
                          packagename: pack.packagename,
                          statevalue:
                            pack.assigned == "station 1"
                              ? 1
                              : pack.statevalue + 1,
                          statedescription:
                            pack.assigned == "station 1"
                              ? statedescription[0]
                              : statedescription[pack.statevalue],
                          received: "false",
                          assigned: pack.assigned,
                          senderemail: pack.senderemail,
                          receiveremail: pack.receiveremail,
                        };
                        console.log(data);
                        await onApproved(data);
                        fetchPackages();
                      }}
                      disabled={
                        pack.statevalue % 2 == 1 &&
                        pack.transactiontype == "In transit"
                          ? true
                          : false
                      }
                    >
                      Arrive
                    </Button>
                    <Button
                      variant="info"
                      onClick={async () => {
                        const data = {
                          package_id: pack.package_id,
                          transactiontype: transactioninfo.transactiontype,
                          packagename: pack.packagename,
                          statevalue: pack.statevalue + 1,
                          statedescription:
                            pack.assigned == "station 1"
                              ? statedescription[1]
                              : statedescription[pack.statevalue],
                          received: "false",
                          assigned:
                            pack.assigned == "station 3"
                              ? pack.receiveremail
                              : `station ${
                                  parseInt(pack.assigned.split(" ")[1]) + 1
                                }`,
                          senderemail: pack.senderemail,
                          receiveremail: pack.receiveremail,
                        };
                        console.log(data);
                        await onDepart(data);
                        fetchPackages();
                      }}
                    >
                      Depart
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          );
        })}
      </div>
      <ToastContainer autoClose={3000} />
    </div>
  );
}

export default Station;
