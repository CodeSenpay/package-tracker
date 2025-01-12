import { yupResolver } from "@hookform/resolvers/yup";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Accordion, Button, Form, Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import Sidebar from "./components/sidebar";
import "./css/dashboard.css";

import {
  getTransactionPackageSet,
  loadPackagesByAssigned,
  sendDataToAPI,
} from "./helpers";

function Dashboard() {
  const [lgShow, setLgShow] = useState(false);
  const [transactioninfo, setTransactioninfo] = useState();

  const [packages, setPackages] = useState([]);

  const schema = yup.object().shape({
    packagename: yup.string().required(),
    packagedescription: yup.string().required(),
    orderby: yup.string().required(),
    customeraddress: yup.string().required(),
    quantity: yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const notifysuccess = (data) => {
    toast.success(data);
  };
  const notifyfailed = (data) => {
    toast.error(data);
  };

  const onApproved = async (data) => {
    const statedescription = transactioninfo.statedescription
      .split("|")
      .map((status) => status.trim());

    const statevalues = transactioninfo.statestatus
      .toString()
      .split("")
      .map((digit) => parseInt(digit, 10));

    const modifiedData = {
      ...data,
      spname: "update_packagestate",
    };

    // transactiontype: transactioninfo.transactiontype,
    // statevalue: transactioninfo.defaultstarting + 1,
    // statedescription: statedescription[1],
    // assigned: "origin",
    console.log(modifiedData);

    const response = await sendDataToAPI(modifiedData);
    const result = await response.json();

    if (result[0][0].statestatus == 1) {
      notifysuccess("Package is prepared by the supplier");
      fetchPackages();
    } else {
      console.log(result[0][0]);
    }
  };

  const onDepart = async (data) => {
    const statedescription = transactioninfo.statedescription
      .split("|")
      .map((status) => status.trim());

    const statevalues = transactioninfo.statestatus
      .toString()
      .split("")
      .map((digit) => parseInt(digit, 10));

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

  const fetchPackages = async () => {
    try {
      const response = await loadPackagesByAssigned("origin");
      const result = await response.json();

      setPackages(result[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onSubmit = async (data) => {
    const statedescription = transactioninfo.statedescription
      .split("|")
      .map((status) => status.trim());

    const statevalues = transactioninfo.statestatus
      .toString()
      .split("")
      .map((digit) => parseInt(digit, 10));

    const modifiedData = {
      ...data,
      transactiontype: transactioninfo.transactiontype,
      statevalue: transactioninfo.defaultstarting,
      statedescription: statedescription[transactioninfo.defaultstarting - 1],
      assigned: "origin",
      spname: "set_transactiondata",
    };
    console.log(modifiedData);

    const response = await sendDataToAPI(modifiedData);
    const result = await response.json();
    console.log(result[0][0]["statuscode"]);

    if (result[0][0]["statuscode"] == 1) {
      reset();
      setLgShow(false);
      await fetchPackages();
      notifysuccess("Package Created Successfully");
      setPackagesCreated(true);
    } else {
      notifyfailed("Failed to send package");
    }
  };

  const fetchDataFromApi = async () => {
    try {
      const response = await getTransactionPackageSet();
      const result = await response.json();

      if (result[0][0].statuscode == 1) {
        setTransactioninfo(result[0][0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    document.title = "Dashboard";
    fetchDataFromApi();
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
        <Button
          variant="success"
          onClick={() => {
            setLgShow(true);
          }}
          className="fixed-button"
        >
          <Icon.PlusSquareFill size={30} />
        </Button>
        {packages?.map((pack, index) => {
          return pack.statuscode == 0 ? (
            <div></div>
          ) : (
            <Accordion
              style={{ padding: "20px", width: "70%", margin: "auto" }}
              defaultActiveKey="0"
            >
              <Accordion.Item eventKey={index}>
                <Accordion.Header>{pack?.packagename}</Accordion.Header>
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
                          transactiontype: "Package Set",
                          statevalue: "2",
                          statedescription:
                            "Package is prepared by the supplier",
                          packagename: pack.packagename,
                          received: "false",
                          assigned: "origin",
                          senderemail: pack.senderemail,
                          receiveremail: pack.receiveremail,
                        };
                        await onApproved(data);
                      }}
                      disabled={
                        pack.statevalue % 2 == 0 &&
                        pack.transactiontype == "Package Set"
                          ? true
                          : false
                      }
                    >
                      Approved
                    </Button>
                    <Button
                      variant="info"
                      onClick={async () => {
                        const data = {
                          package_id: pack.package_id,
                          transactiontype: "Package Set",
                          statevalue: "3",
                          statedescription:
                            "Parcel has departed from the facility",
                          packagename: pack.packagename,
                          received: "false",
                          assigned: "station 1",
                          senderemail: pack.senderemail,
                          receiveremail: pack.receiveremail,
                        };
                        await onDepart(data);
                        await fetchPackages();
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

        <Modal
          show={lgShow}
          onHide={() => setLgShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton style={{ backgroundColor: "#314051" }}>
            <Modal.Title
              id="example-modal-sizes-title-lg"
              style={{ color: "white" }}
            >
              Package Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Form.Label htmlFor="inputPackage">Package</Form.Label>
              <Form.Control
                type="text"
                id="inputPackage"
                placeholder="Package Name"
                {...register("packagename")}
              />
              <br />
              <Form.Label htmlFor="inputDescription">Description</Form.Label>
              <Form.Control
                type="text"
                id="inputDescription"
                placeholder="Description"
                {...register("packagedescription")}
              />
              <br />
              <Form.Label htmlFor="inputReceiver">Send To</Form.Label>
              <Form.Control
                type="text"
                id="inputReceiver"
                placeholder="Receiver"
                {...register("orderby")}
              />
              <br />
              <Form.Label htmlFor="inputReceiverAddress">
                Receiver Address
              </Form.Label>
              <Form.Control
                type="text"
                id="inputReceiverAddress"
                placeholder="Receiver Address"
                {...register("customeraddress")}
              />
              <br />
              <Form.Label htmlFor="inputQuantity">Receiver Email</Form.Label>
              <Form.Control
                type="text"
                id="inputQuantity"
                placeholder="Receiver Email"
                {...register("receiveremail")}
              />

              <br />
              <Form.Label htmlFor="inputQuantity">Quantity</Form.Label>
              <Form.Control
                type="text"
                id="inputQuantity"
                placeholder="Quantity"
                {...register("quantity")}
              />
              <br />
              <Form.Label htmlFor="inputSender">Sender</Form.Label>
              <Form.Control
                type="text"
                id="inputSender"
                placeholder="Sender Name"
                {...register("supplier")}
              />
              <br />
              <Form.Label htmlFor="inputSenderAddress">
                Sender Address
              </Form.Label>
              <Form.Control
                type="text"
                id="inputSenderAddress"
                placeholder="Sender Address"
                {...register("supplieraddress")}
              />
              <br />
              <Form.Label htmlFor="inputSenderAddress">Sender Email</Form.Label>
              <Form.Control
                type="email"
                id="inputSenderAddress"
                placeholder="Sender Address"
                {...register("senderemail")}
              />
              <br />
              <Button variant="dark" type="submit">
                SUBMIT
              </Button>
            </form>
          </Modal.Body>
        </Modal>

        <ToastContainer autoClose={3000} />
      </div>
    </div>
  );
}

export default Dashboard;
