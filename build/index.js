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
app.get("/:id", function (req, res) {
    var _a;
    var id = ((_a = req.params) === null || _a === void 0 ? void 0 : _a.id) ? parseInt(req.params.id) : null;
    if (!id) {
        res.send("Error fetching id");
        return;
    }
    (0, database_1.getUserById)(id)
        .then(function (user) {
        if (!user) {
            res.send("Cannot find user");
            return;
        }
        res.send(user);
    })
        .catch(function (err) {
        res.send("Get user by id failed, ".concat(err));
    });
});
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
