import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import CartItems from "./CartItems";
import { StripeProvider } from "react-stripe-elements";
import config from "./../../config/config";
import CheckoutPage from "./CheckoutPage";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
}));

export default function Cart() {
  const cssprops = useStyles();
  const [checkout, setCheckout] = useState(false);

  const showCheckout = (val) => {
    setCheckout(val);
  };

  return (
    <div className={cssprops.root}>
      <Grid container spacing={8}>
        <Grid item xs={6} sm={6}>
          <CartItems checkout={checkout} setCheckout={showCheckout} />
        </Grid>
        {checkout && (
          <Grid item xs={6} sm={6}>
            <StripeProvider apiKey={config.stripe_test_api_key}>
              <CheckoutPage />
            </StripeProvider>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
