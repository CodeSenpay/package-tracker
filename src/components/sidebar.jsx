import "../css/sidebar.css";
import * as Icon from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
function Sidebar() {
  return (
    <div className="Sidebar">
      <ul className="SidebarList">
        <div className="header">
          <Icon.GlobeCentralSouthAsia color="white" />
          <div>Package Tracker</div>
        </div>
        <hr />
        <li
          className={window.location.pathname === "/dashboard" ? "Active" : ""}
        >
          <Icon.HouseFill color="white" />
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <div className="titles">Dashboard</div>
          </Link>
        </li>
        <hr />
        <li
          className={window.location.pathname === "/intransit" ? "Active" : ""}
        >
          <Icon.Truck color="white" />
          <Link to="/intransit" style={{ textDecoration: "none" }}>
            <div className="titles">In Transit</div>
          </Link>
        </li>
        <hr />
        <li
          className={window.location.pathname === "/completed" ? "Active" : ""}
        >
          <Icon.CheckCircleFill color="white" />
          <Link to="/completed" style={{ textDecoration: "none" }}>
            <div className="titles">Completed</div>
          </Link>
        </li>

        <hr />
      </ul>
      <Button variant="warning">
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          Log Out
        </Link>
      </Button>
    </div>
  );
}

export default Sidebar;
