import express, { Request, Response } from "express";
import { createUser, getUserByEmail } from "./database/database";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/users/new", (req: Request, res: Response) => {
  const { email, username, firstName, lastName } = req.body;

  if (!email || !username || !firstName || !lastName) {
    return res.status(400).send({
      error: "ValidationError",
      success: false,
    });
  }

  createUser(email, username, firstName, lastName)
    .then((userId) => {
      res.status(201).send({
        error: undefined,
        data: { id: userId, email, username, firstName, lastName },
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      const isUniqueConstraint =
        err.code === "SQLITE_CONSTRAINT" && err.message.includes("UNIQUE");
      const usernameDuplicated = err.message.includes("username");
      const emailDuplicated = err.message.includes("email");

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

app.get("/users", (req: Request, res: Response) => {
  const email = req.query.email;

  console.log(email);

  if (!email) {
    return res.status(400).send({
      error: "EmailParameterRequired",
      success: false,
    });
  }

  getUserByEmail(email as string)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ error: "UserNotFound", success: false });
      }

      res.json(user);
    })
    .catch(() => {
      return res.status(500).send({ error: "ServerError", success: false });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
