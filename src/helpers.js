export const sendDataToAPI = async (formData) => {
  try {
    const url = "http://localhost:5000/update";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to send data to API");
    }

    return await response;

    console.log("API response:", data);
  } catch (error) {
    console.error("Error sending data to API:", error.message);
  }
};

export const getTransactionPackageSet = async () => {
  try {
    const url = "http://localhost:5000/update";
    const transactionData = {
      transactiontype: "Package Set",
      spname: "load_transactiontype",
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error("Failed to send data to API");
    }

    return await response;

    console.log("API response:", data);
  } catch (error) {
    console.error("Error sending data to API:", error.message);
  }
};

export const getTransactionIntransit = async () => {
  try {
    const url = "http://localhost:5000/update";
    const transactionData = {
      transactiontype: "In transit",
      spname: "load_transactiontype",
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error("Failed to send data to API");
    }

    return await response;

    console.log("API response:", data);
  } catch (error) {
    console.error("Error sending data to API:", error.message);
  }
};

export const getTransaction = async (transactype) => {
  try {
    const url = "http://localhost:5000/update";
    const transactionData = {
      transactiontype: transactype,
      spname: "load_transactiontype",
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error("Failed to send data to API");
    }

    return await response;

    console.log("API response:", data);
  } catch (error) {
    console.error("Error sending data to API:", error.message);
  }
};

export const getTransactionDelivered = async () => {
  try {
    const url = "http://localhost:5000/update";
    const transactionData = {
      transactiontype: "Delivered",
      spname: "load_transactiontype",
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error("Failed to send data to API");
    }

    return await response;

    console.log("API response:", data);
  } catch (error) {
    console.error("Error sending data to API:", error.message);
  }
};

export const loadPackagesByAssigned = async (assigned) => {
  try {
    const url = "http://localhost:5000/update";
    const transactionData = {
      assigned: assigned,
      spname: "load_assignedstate",
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error("Failed to send data to API");
    }
    return await response;
  } catch (error) {
    console.error("Error sending data to API:", error.message);
  }
};

export const loadPackagesByTransactionType = async (transactype) => {
  try {
    const url = "http://localhost:5000/update";
    const transactionData = {
      transactiontype: transactype,
      spname: "load_packagebytransactiontype",
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error("Failed to send data to API");
    }
    return await response;
  } catch (error) {
    console.error("Error sending data to API:", error.message);
  }
};

export const loadPackagesByEmail = async (email) => {
  try {
    const url = "http://localhost:5000/update";
    const transactionData = {
      email: email,
      spname: "load_packagebyemail",
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error("Failed to send data to API");
    }
    return await response;
  } catch (error) {
    console.error("Error sending data to API:", error.message);
  }
};
