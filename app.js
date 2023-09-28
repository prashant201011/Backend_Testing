const express = require("express");
const mongoose = require("mongoose");
const buyerRouter = require("./router/buyer");
const bodyParser = require("body-parser");
const app = express();
var cors = require("cors");
var corsOption = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ["x-auth-token"],
};
app.use(cors(corsOption));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
    .connect(
        "mongodb+srv://prashant:prashant@cluster0.5ulabmu.mongodb.net/BuyerApp"
    )
    .then((res) => {
        console.log("mongoDB connected");
    })
    .catch((error) => {
        console.log(error);
    });

app.use(buyerRouter);

app.listen(3000, () => {
    console.log("connected to server");
});
