import Sidebar from "./components/sidebar";
import { useEffect, useState } from "react";

import {
  getTransactionIntransit,
  loadPackagesByTransactionType,
} from "./helpers";
import { Accordion, Badge } from "react-bootstrap";
import Stepper from "./components/stepper";

function InTransit() {
  const [transactioninfo, setTransactioninfo] = useState();
  const [packages, setPackages] = useState();
  const [statedescription, setStateDescription] = useState();
  const [statestatus, setStateStatus] = useState();

  const fetchPackages = async () => {
    try {
      const response = await loadPackagesByTransactionType("In transit");
      const result = await response.json();

      if (result[0][0].statuscode == 1) {
        setPackages(result[0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    document.title = "In Transit";
    const fetchDataFromApi = async () => {
      try {
        const response = await getTransactionIntransit();
        const result = await response.json();

        if (result[0][0].statuscode == 1) {
          setTransactioninfo(result[0][0]);
          setStateDescription(result[0][0].statedescription.split("|"));
          setStateStatus(Array.from(String(result[0][0].statestatus), Number));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataFromApi();
    fetchPackages();
  }, []);
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ width: "100%", height: "100vh", overflow: "auto" }}>
        {packages?.map((pack, index) => {
          return (
            <Accordion
              style={{ padding: "20px", width: "70%", margin: "auto" }}
              defaultActiveKey="0"
            >
              <Accordion.Item eventKey={index}>
                <Accordion.Header>
                  {pack?.packagename} <Badge bg="primary">In Transit</Badge>
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
          );
        })}
      </div>
    </div>
  );
}

export default InTransit;
