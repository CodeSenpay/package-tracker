import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Accordion, Badge } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/sidebar";
import "./css/dashboard.css";
import { loadPackagesByTransactionType } from "./helpers";

function Completed() {
  const [packages, setPackages] = useState([]);

  const notifysuccess = (data) => {
    toast.success(data);
  };
  const notifyfailed = (data) => {
    toast.error(data);
  };

  const fetchPackages = async () => {
    try {
      const response = await loadPackagesByTransactionType("Delivered");
      const result = await response.json();

      setPackages(result[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    document.title = "Dashboard";

    const interval = setInterval(() => {
      fetchPackages();
      console.log(packages);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ width: "100%", height: "100vh", overflow: "auto" }}>
        {packages?.map((pack, index) => {
          return pack.statuscode == 0 ? (
            <div></div>
          ) : (
            <Accordion
              style={{ padding: "20px", width: "70%", margin: "auto" }}
              defaultActiveKey="0"
            >
              <Accordion.Item eventKey={index}>
                <Accordion.Header>
                  {pack?.packagename} <Badge bg="success">Completed</Badge>
                </Accordion.Header>
                <Accordion.Body>
                  <p>Package Description: {pack?.packagedescription}</p>
                  <p>Sender: {pack?.supplier}</p>
                  <p>Sender Address: {pack?.supplieraddress}</p>
                  <p>Receiver: {pack?.orderby}</p>
                  <p>Receiver Address: {pack?.customeraddress}</p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          );
        })}
        <ToastContainer autoClose={3000} />
      </div>
    </div>
  );
}

export default Completed;
