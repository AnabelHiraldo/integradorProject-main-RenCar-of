import React, { useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Paypal({ mount, paypalHandleSubmit}) {
  useEffect(() => {
    console.log(mount);
  }, []);




  const initialOptions = {
    clientId:
      "AfPc0YPgOCT2vCt3gJkqC2MoTUfSMu3YWTAyeOdsYorG7hddG6MNbhkXbVpsRVNnC7Y7A8SF93KJPkjJ",
    currency: "USD",
  };

  const styles = {
    shape: "rect",
    layout: "vertical",
  };

  return (
    <div className="App">
      {/* El proveedor de PayPal debe envolver todos los componentes de PayPal */}
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={styles}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: mount,
                  },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              //   alert(`Transaction completed by ${details.payer.name.given_name}`);
              // setSuccess(details)
              paypalHandleSubmit(details)
            });
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
