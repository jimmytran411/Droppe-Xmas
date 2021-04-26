const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const cartsRoute = require("./routes/carts-route");

const corsOptions = {
 origin: "http://localhost:3000",
 optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", cartsRoute);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "frontend/build")));
const root = path.join(__dirname, "frontend", "build");
app.use(express.static(root));
app.get("*", (req, res) => {
 res.sendFile("index.html", { root });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
 console.log(`server started on port ${PORT}`);
});

app.use((req, res) => {
 res.status(404).json({
  message: "Route Not Found",
 });
});
app.use((err, req, res) => {
 res.status(err.status || 500).json({
  message: err.message,
  error: {},
 });
});

module.export = app;
