import express from "express";
import mongoose from "mongoose";
import productsRouter from "./routes/products.js";

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/Products_DB_Dev");

const connection = mongoose.connection;

connection.once("connected", () => console.log("Database is connected..."));
connection.on("error", (error) => console.log("Database connectivity error..."));

app.use("/product", productsRouter);

app.listen(2024, () =>{
    console.log("Server is running at port 2024.");
})