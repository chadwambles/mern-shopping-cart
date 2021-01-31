import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import auth from "./../auth/tool";
import { filterByUser } from "./api";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: "12px 24px",
    padding: theme.spacing(3),
    backgroundColor: "#3f3f3f0d",
  }),
  title: {
    margin: `${theme.spacing(2)}px 0 12px ${theme.spacing(1)}px`,
    color: theme.palette.title,
  },
}));

export default function MyOrdersPage() {
  const cssprops = useStyles();
  const [orders, setOrders] = useState([]);
  const jwt = auth.isAuth();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    filterByUser(
      {
        userId: jwt.user._id,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrders(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <Paper className={cssprops.root} elevation={4}>
      <Typography type="title" className={cssprops.title}>
        Your Orders
      </Typography>
      <List dense>
        {orders.map((order, i) => {
          return (
            <span key={i}>
              <Link to={"/order/" + order._id}>
                <ListItem button>
                  <ListItemText
                    primary={<strong>{"Order # " + order._id}</strong>}
                    secondary={new Date(order.created).toDateString()}
                  />
                </ListItem>
              </Link>
              <Divider />
            </span>
          );
        })}
      </List>
    </Paper>
  );
}
