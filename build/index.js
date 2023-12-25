"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var database_1 = require("./database/database");
var app = (0, express_1.default)();
var port = 3000;
app.use(express_1.default.json());
app.get("/", function (req, res) {
    res.send("Hello World!");
});
app.post("/users/new", function (req, res) {
    var _a = req.body, email = _a.email, username = _a.username, firstName = _a.firstName, lastName = _a.lastName;
    if (!email || !username || !firstName || !lastName) {
        return res.status(400).send({
            error: "ValidationError",
            success: false,
        });
    }
    (0, database_1.createUser)(email, username, firstName, lastName)
        .then(function (userId) {
        res.status(201).send({
            error: undefined,
            data: { id: userId, email: email, username: username, firstName: firstName, lastName: lastName },
            success: true,
        });
    })
        .catch(function (err) {
        console.log(err);
        var isUniqueConstraint = err.code === "SQLITE_CONSTRAINT" && err.message.includes("UNIQUE");
        var usernameDuplicated = err.message.includes("username");
        var emailDuplicated = err.message.includes("email");
        if (isUniqueConstraint && usernameDuplicated) {
            return res.status(500).send({
                error: "UsernameAlreadyTaken",
                success: false,
            });
        }
        if (isUniqueConstraint && emailDuplicated) {
            return res.status(500).send({
                error: "EmailAlreadyInUse",
                success: false,
            });
        }
        res.status(500).send({
            error: "ServerError",
            success: false,
        });
    });
});
app.get("/users", function (req, res) {
    var email = req.query.email;
    console.log(email);
    if (!email) {
        return res.status(400).send({
            error: "EmailParameterRequired",
            success: false,
        });
    }
    (0, database_1.getUserByEmail)(email)
        .then(function (user) {
        if (!user) {
            return res.status(404).send({ error: "UserNotFound", success: false });
        }
        res.json(user);
    })
        .catch(function () {
        return res.status(500).send({ error: "ServerError", success: false });
    });
});
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
