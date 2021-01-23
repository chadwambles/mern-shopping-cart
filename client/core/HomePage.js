import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Recommendations from "./../product/Recommendations";
import { filterByLatest, filterByCategories } from "./../product/api";
import Search from "../product/Search";
import Categories from "../product/Categories";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
}));

export default function HomePage() {
  const cssprops = useStyles();
  const [recommendationTitle, setRecommendationTitle] = useState(
    "Latest Products"
  );
  const [categories, setCategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    filterByLatest(signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setRecommendations(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    filterByCategories(signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategories(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <div className={cssprops.root}>
      <Grid container spacing={2}>
        <Grid item xs={8} sm={8}>
          <Search categories={categories} />
          <Categories categories={categories} />
        </Grid>
        <Grid item xs={4} sm={4}>
          <Recommendations
            products={recommendations}
            title={recommendationTitle}
          />
        </Grid>
      </Grid>
    </div>
  );
}
