const express = require("express");
const path = require("path");
const app = require("./app");

app.listen(3000);

app.use(express.json());

/// definir rutas para el fronend

app.use("/inicio", express.static(path.resolve("views", "home")));

app.use("/admin", express.static(path.resolve("views", "login")));
