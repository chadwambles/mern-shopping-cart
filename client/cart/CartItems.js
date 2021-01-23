import React, { useState } from "react";
import auth from "./../auth/tool";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import shoppingCart from "./tool";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: "24px 0px",
    padding: "16px 40px 60px 40px",
    backgroundColor: "#80808017",
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.title,
    fontSize: "1.2em",
  },
  price: {
    color: theme.palette.text.secondary,
    display: "inline",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: 0,
    width: 50,
  },
  productTitle: {
    fontSize: "1.15em",
    marginBottom: "5px",
  },
  subheading: {
    color: theme.palette.title,
    padding: "8px 10px 0",
    cursor: "pointer",
    display: "inline-block",
  },
  cart: {
    width: "100%",
    display: "inline-flex",
  },
  details: {
    display: "inline-block",
    width: "100%",
    padding: "4px",
  },
  content: {
    flex: "1 0 auto",
    padding: "16px 8px 0px",
  },
  cover: {
    width: 160,
    height: 125,
    margin: "8px",
  },
  itemTotal: {
    float: "right",
    marginRight: "40px",
    fontSize: "1.5em",
    color: theme.palette.title,
  },
  checkout: {
    float: "right",
    margin: "24px",
  },
  total: {
    fontSize: "1.2em",
    color: theme.palette.title,
    marginRight: "16px",
    fontWeight: "600",
    verticalAlign: "bottom",
  },
  continueBtn: {
    marginLeft: "10px",
  },
  itemShop: {
    display: "block",
    fontSize: "0.90em",
    color: theme.palette.title,
  },
  removeButton: {
    fontSize: "0.8em",
  },
}));

export default function CartItems(props) {
  const cssprops = useStyles();
  const [cartItems, setCartItems] = useState(shoppingCart.getShoppingCart());

  const handleChange = (index) => (event) => {
    let updatedCartItems = cartItems;
    if (event.target.value == 0) {
      updatedCartItems[index].quantity = 1;
    } else {
      updatedCartItems[index].quantity = event.target.value;
    }
    setCartItems([...updatedCartItems]);
    shoppingCart.updateShoppingCart(index, event.target.value);
  };

  const getOrderTotal = () => {
    return cartItems.reduce((x, y) => {
      return x + y.quantity * y.product.price;
    }, 0);
  };

  const removeItem = (index) => (event) => {
    let updatedCartItems = shoppingCart.removeItem(index);
    if (updatedCartItems.length == 0) {
      props.setCheckout(false);
    }
    setCartItems(updatedCartItems);
  };

  const openCheckout = () => {
    props.setCheckout(true);
  };

  return (
    <Card className={cssprops.card}>
      <Typography type="title" className={cssprops.title}>
        Shopping Cart
      </Typography>
      {cartItems.length > 0 ? (
        <span>
          {cartItems.map((item, i) => {
            return (
              <span key={i}>
                <Card className={cssprops.cart}>
                  <CardMedia
                    className={cssprops.cover}
                    image={"/api/product/image/" + item.product._id}
                    title={item.product.name}
                  />
                  <div className={cssprops.details}>
                    <CardContent className={cssprops.content}>
                      <Link to={"/product/" + item.product._id}>
                        <Typography
                          type="title"
                          component="h3"
                          className={cssprops.productTitle}
                          
                        >
                          {item.product.name}
                        </Typography>
                      </Link>
                      <div>
                        <Typography
                          type="subheading"
                          component="h3"
                          className={cssprops.price}
                          
                        >
                          $ {item.product.price}
                        </Typography>
                        <span className={cssprops.itemTotal}>
                          ${item.product.price * item.quantity}
                        </span>
                        <span className={cssprops.itemShop}>
                          Shop: {item.product.shop.name}
                        </span>
                      </div>
                    </CardContent>
                    <div className={cssprops.subheading}>
                      Quantity:{" "}
                      <TextField
                        value={item.quantity}
                        onChange={handleChange(i)}
                        type="number"
                        inputProps={{
                          min: 1,
                        }}
                        className={cssprops.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                      />
                      <Button
                        className={cssprops.removeButton}
                        
                        onClick={removeItem(i)}
                      >
                        x Remove
                      </Button>
                    </div>
                  </div>
                </Card>
                <Divider />
              </span>
            );
          })}
          <div className={cssprops.checkout}>
            <span className={cssprops.total}>Total: ${getOrderTotal()}</span>
            {!props.checkout &&
              (auth.isAuth() ? (
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={openCheckout}
                >
                  Checkout
                </Button>
              ) : (
                <Link to="/signin">
                  <Button  variant="contained">
                    Sign in to checkout
                  </Button>
                </Link>
              ))}
            <Link to="/" className={cssprops.continueBtn}>
              <Button variant="contained">Continue Shopping</Button>
            </Link>
          </div>
        </span>
      ) : (
        <Typography variant="subtitle1" component="h3" >
          No items added to your cart.
        </Typography>
      )}
    </Card>
  );
}

CartItems.propTypes = {
  checkout: PropTypes.bool.isRequired,
  setCheckout: PropTypes.func.isRequired,
};
