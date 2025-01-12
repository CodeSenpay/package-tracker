import "../css/stepper.css";

function Stepper({
  packInfo = {},
  transacInfo = {},
  description = [],
  statestatus = [],
}) {
  return (
    <div className="main-stepper">
      <h4>{packInfo["transactiontype"]}</h4>
      <div className="stepper">
        {statestatus.map((state) => {
          return (
            <div className="step">
              <div>{packInfo.statevalue >= state ? "✔" : state}</div>
            </div>
          );
        })}
      </div>
      <p>{description[packInfo.statevalue - 1]}</p>
    </div>
  );
}

export default Stepper;
