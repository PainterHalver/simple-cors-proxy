const express = require("express");
const axios = require("axios");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
let corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
axios.defaults.timeout = 5000;

const port = process.env.PORT || 5000;

app.listen(port, function () {
  console.log("Proxy server listening on port " + port);
});

// https://calputer.herokuapp.com/api/word/感じる
app.all("/*", async function (req, res, next) {
  try {
    if (!req.url) {
      res.status(500).send({
        error: "There is no url request params",
      });
      return;
    }
    const url = req.url.slice(1);
    console.log(url);
    const response = await axios({
      url: url,
      method: req.method,
      data: req.body,
      headers: { "Content-Type": "application/json" },
    });
    const { data } = response;
    res.status(200).json(data);
  } catch (error) {
    if (error.errno === -4078) {
      res.status(500).json({
        error,
      });
    } else {
      res.status(418).json({
        me: "?? A tea pot ??",
        error,
      });
    }
  }
});

app.get("*", (req, res, next) => {
  res.status(200).json({
    data: "This route is not defined!",
  });
});
