import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import auth from "./../auth/tool";
import { filterbyShop } from "./api";
import EditOrderPage from "./EditOrderPage";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(
      1
    )}px`,
    color: theme.palette.title,
    fontSize: "1.2em",
  },
  subheading: {
    marginTop: theme.spacing(1),
    color: theme.palette.title,
    fontSize: "1.1em",
  },
  customerDetails: {
    paddingLeft: "36px",
    paddingTop: "16px",
    backgroundColor: "#f8f8f8",
  },
}));
export default function ShopOrdersList({ match }) {
  const cssprops = useStyles();
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(0);

  const jwt = auth.isAuth();
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    filterbyShop(
      {
        shopId: match.params.shopId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data.error) {
        console.log(data);
      } else {
        setOrders(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const handleClick = (index) => (event) => {
    setOpen(index);
  };

  const updateOrders = (index, updatedOrder) => {
    let updatedOrders = orders;
    updatedOrders[index] = updatedOrder;
    setOrders([...updatedOrders]);
  };

  return (
    <div>
      <Paper className={cssprops.root} elevation={4}>
        <Typography type="title" className={cssprops.title}>
          Orders in {match.params.shop}
        </Typography>
        <List dense>
          {orders.map((order, index) => {
            return (
              <span key={index}>
                <ListItem button onClick={handleClick(index)}>
                  <ListItemText
                    primary={"Order # " + order._id}
                    secondary={new Date(order.created).toDateString()}
                  />
                  {open == index ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Divider />
                <Collapse
                  component="li"
                  in={open == index}
                  timeout="auto"
                  unmountOnExit
                >
                  <EditOrderPage
                    shopId={match.params.shopId}
                    order={order}
                    orderIndex={index}
                    updateOrders={updateOrders}
                  />
                  <div className={cssprops.customerDetails}>
                    <Typography
                      type="subheading"
                      component="h3"
                      className={cssprops.subheading}
                    >
                      Deliver to:
                    </Typography>
                    <Typography
                      type="subheading"
                      component="h3"
                      color="primary"
                    >
                      <strong>{order.customer_name}</strong> (
                      {order.customer_email})
                    </Typography>
                    <Typography
                      type="subheading"
                      component="h3"
                      color="primary"
                    >
                      {order.delivery_address.street}
                    </Typography>
                    <Typography
                      type="subheading"
                      component="h3"
                      color="primary"
                    >
                      {order.delivery_address.city},{" "}
                      {order.delivery_address.state}{" "}
                      {order.delivery_address.zipcode}
                    </Typography>
                    <Typography
                      type="subheading"
                      component="h3"
                      color="primary"
                    >
                      {order.delivery_address.country}
                    </Typography>
                    <br />
                  </div>
                </Collapse>
                <Divider />
              </span>
            );
          })}
        </List>
      </Paper>
    </div>
  );
}
