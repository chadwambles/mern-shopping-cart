import express from "express";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import Template from "./../template";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import shopRoutes from "./routes/shopRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
// modules for server side rendering
import React from "react";
import ReactDOMServer from "react-dom/server";
import MainRouter from "./../views/MainRouter";
import { StaticRouter } from "react-router-dom";

import { ServerStyleSheets, ThemeProvider } from "@material-ui/styles";
import theme from "./../views/theme";
//end

//comment out before building for production
import devBundle from "./devBundle";

const CURRENT_WORKING_DIR = process.cwd();
const server = express();

//comment out before building for production
devBundle.compile(server);

// parse body params and attache them to req.body
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(compress());
// secure servers by setting various HTTP headers
server.use(helmet());
// enable CORS - Cross Origin Resource Sharing
server.use(cors());
server.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")));
// mount routes
server.use("/", userRoutes);
server.use("/", authRoutes);
server.use("/", shopRoutes);
server.use("/", productRoutes);
server.use("/", orderRoutes);
server.get("*", (req, res) => {
  const sheets = new ServerStyleSheets();
  const context = {};
  const markup = ReactDOMServer.renderToString(
    sheets.collect(
      <StaticRouter location={req.url} context={context}>
        <ThemeProvider theme={theme}>
          <MainRouter />
        </ThemeProvider>
      </StaticRouter>
    )
  );
  if (context.url) {
    return res.redirect(303, context.url);
  }
  const css = sheets.toString();
  res.status(200).send(
    Template({
      markup: markup,
      css: css,
    })
  );
});

// Catch unauthorised errors
server.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});

export default server;
