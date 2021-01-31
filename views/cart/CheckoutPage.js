import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import auth from "./../auth/tool";
import shoppingCart from "./tool";
import PlaceOrderPage from "./PlaceOrderPage";
import { Elements } from "react-stripe-elements";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: "24px 0px",
    padding: "16px 40px 90px 40px",
    backgroundColor: "#80808017",
  },
  title: {
    margin: "24px 16px 8px 0px",
    color: theme.palette.title,
  },
  subheading: {
    color: theme.palette.title,
    marginTop: "20px",
  },
  addressField: {
    marginTop: "4px",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "45%",
  },
  streetField: {
    marginTop: "4px",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "93%",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "90%",
  },
}));

export default function CheckoutPage() {
  const cssprops = useStyles();
  const user = auth.isAuth().user;
  const [values, setValues] = useState({
    checkoutDetails: {
      products: shoppingCart.getShoppingCart(),
      customer_name: user.name,
      customer_email: user.email,
      delivery_address: {
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
      },
    },
    error: "",
  });

  const handleCustomerChange = (name) => (event) => {
    let checkoutDetails = values.checkoutDetails;
    checkoutDetails[name] = event.target.value || undefined;
    setValues({ ...values, checkoutDetails: checkoutDetails });
  };

  const handleAddressChange = (name) => (event) => {
    let checkoutDetails = values.checkoutDetails;
    checkoutDetails.delivery_address[name] = event.target.value || undefined;
    setValues({ ...values, checkoutDetails: checkoutDetails });
  };

  return (
    <Card className={cssprops.card}>
      <Typography type="title" className={cssprops.title}>
        Checkout
      </Typography>
      <TextField
        id="name"
        label="Name"
        className={cssprops.textField}
        value={values.checkoutDetails.customer_name}
        onChange={handleCustomerChange("customer_name")}
        margin="normal"
      />
      <br />
      <TextField
        id="email"
        type="email"
        label="Email"
        className={cssprops.textField}
        value={values.checkoutDetails.customer_email}
        onChange={handleCustomerChange("customer_email")}
        margin="normal"
      />
      <br />
      <Typography
        type="subheading"
        component="h3"
        className={cssprops.subheading}
      >
        Delivery Address
      </Typography>
      <TextField
        id="street"
        label="Street Address"
        className={cssprops.streetField}
        value={values.checkoutDetails.delivery_address.street}
        onChange={handleAddressChange("street")}
        margin="normal"
      />
      <br />
      <TextField
        id="city"
        label="City"
        className={cssprops.addressField}
        value={values.checkoutDetails.delivery_address.city}
        onChange={handleAddressChange("city")}
        margin="normal"
      />
      <TextField
        id="state"
        label="State"
        className={cssprops.addressField}
        value={values.checkoutDetails.delivery_address.state}
        onChange={handleAddressChange("state")}
        margin="normal"
      />
      <br />
      <TextField
        id="zipcode"
        label="Zip Code"
        className={cssprops.addressField}
        value={values.checkoutDetails.delivery_address.zipcode}
        onChange={handleAddressChange("zipcode")}
        margin="normal"
      />
      <TextField
        id="country"
        label="Country"
        className={cssprops.addressField}
        value={values.checkoutDetails.delivery_address.country}
        onChange={handleAddressChange("country")}
        margin="normal"
      />
      <br />{" "}
      {values.error && (
        <Typography component="p" color="error">
          <Icon color="error" className={cssprops.error}>
            error
          </Icon>
          {values.error}
        </Typography>
      )}
      <div>
        <Elements>
          <PlaceOrderPage checkoutDetails={values.checkoutDetails} />
        </Elements>
      </div>
    </Card>
  );
}
