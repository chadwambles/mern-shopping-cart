import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import { read } from "./api";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  card: {
    textAlign: "center",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    flexGrow: 1,
    margin: 30,
  },
  cart: {
    textAlign: "left",
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
  info: {
    color: theme.palette.title,
    fontSize: "0.95rem",
    display: "inline",
  },
  thanks: {
    color: theme.palette.title,
    fontSize: "0.9rem",
    fontStyle: "italic",
  },
  innerCardItems: {
    textAlign: "left",
    margin: "24px 10px 24px 24px",
    padding: "24px 20px 40px 20px",
    backgroundColor: "#80808017",
  },
  innerCard: {
    textAlign: "left",
    margin: "24px 24px 24px 10px",
    padding: "30px 45px 40px 45px",
    backgroundColor: "#80808017",
  },
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    color: theme.palette.title,
    fontSize: "1.2em",
  },
  subheading: {
    marginTop: theme.spacing(1),
    color: theme.palette.title,
  },
  productTitle: {
    fontSize: "1.15em",
    marginBottom: "5px",
  },
  itemTotal: {
    float: "right",
    marginRight: "40px",
    fontSize: "1.5em",
    color: theme.palette.title,
  },
  itemShop: {
    display: "block",
    fontSize: "1em",
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
}));

export default function OrderPage({ match }) {
  const cssprops = useStyles();
  const [order, setOrder] = useState({ products: [], delivery_address: {} });

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    read({
      orderId: match.params.orderId,
    }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrder(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const getOrderTotal = () => {
    return order.products.reduce((a, b) => {
      const quantity = b.status == "Cancelled" ? 0 : b.quantity;
      return a + quantity * b.product.price;
    }, 0);
  };

  return (
    <Card className={cssprops.card}>
      <Typography type="headline" component="h2" className={cssprops.title}>
        Itemized Order Details
      </Typography>
      <Typography
        type="subheading"
        component="h2"
        className={cssprops.subheading}
      >
        Order Code: <strong>{order._id}</strong> <br /> Placed on{" "}
        {new Date(order.created).toDateString()}
      </Typography>
      <br />
      <Grid container spacing={4}>
        <Grid item xs={7} sm={7}>
          <Card className={cssprops.innerCardItems}>
            {order.products.map((item, i) => {
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
                            color="primary"
                          >
                            {item.product.name}
                          </Typography>
                        </Link>
                        <Typography
                          type="subheading"
                          component="h3"
                          className={cssprops.itemShop}
                          color="primary"
                        >
                          $ {item.product.price} x {item.quantity}
                        </Typography>
                        <span className={cssprops.itemTotal}>
                          ${item.product.price * item.quantity}
                        </span>
                        <span className={cssprops.itemShop}>
                          Shop: {item.shop.name}
                        </span>
                        <Typography
                          type="subheading"
                          component="h3"
                          color={
                            item.status == "Cancelled" ? "error" : "secondary"
                          }
                        >
                          Status: {item.status}
                        </Typography>
                      </CardContent>
                    </div>
                  </Card>
                  <Divider />
                </span>
              );
            })}
            <div className={cssprops.checkout}>
              <span className={cssprops.total}>Total: ${getOrderTotal()}</span>
            </div>
          </Card>
        </Grid>
        <Grid item xs={5} sm={5}>
          <Card className={cssprops.innerCard}>
            <Typography
              type="subheading"
              component="h2"
              className={cssprops.productTitle}
              color="primary"
            >
              Deliver to:
            </Typography>
            <Typography
              type="subheading"
              component="h3"
              className={cssprops.info}
              color="primary"
            >
              <strong>{order.customer_name}</strong>
            </Typography>
            <br />
            <Typography
              type="subheading"
              component="h3"
              className={cssprops.info}
              color="primary"
            >
              {order.customer_email}
            </Typography>
            <br />
            <br />
            <Divider />
            <br />
            <Typography
              type="subheading"
              component="h3"
              className={cssprops.itemShop}
              color="primary"
            >
              {order.delivery_address.street}
            </Typography>
            <Typography
              type="subheading"
              component="h3"
              className={cssprops.itemShop}
              color="primary"
            >
              {order.delivery_address.city}, {order.delivery_address.state}{" "}
              {order.delivery_address.zipcode}
            </Typography>
            <Typography
              type="subheading"
              component="h3"
              className={cssprops.itemShop}
              color="primary"
            >
              {order.delivery_address.country}
            </Typography>
            <br />
            <Typography
              type="subheading"
              component="h3"
              className={cssprops.thanks}
              color="primary"
            >
              Thank you for shopping with us! <br />
              You can track the status of your purchased items on this page.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
}
