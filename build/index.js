"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var database_1 = require("./database/database");
var app = (0, express_1.default)();
var port = 3000;
app.get("/", function (req, res) {
    res.send("Hello World!");
});
app.get("/user", function (req, res) {
    var email = req.query.email;
    if (!email) {
        return res.status(400).send({
            error: "Email parameter is required",
            data: undefined,
            success: false,
        });
    }
    (0, database_1.getUserByEmail)(email)
        .then(function (user) {
        if (!user) {
            return res
                .status(404)
                .send({ error: "User not found", data: undefined, success: false });
        }
        res.json(user);
    })
        .catch(function () {
        return res
            .status(500)
            .send({ error: "Server error", data: undefined, success: false });
    });
});
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
