import express, { Request, Response } from "express";
import { getUserByEmail } from "./database/database";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/user", (req: Request, res: Response) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).send({
      error: "Email parameter is required",
      data: undefined,
      success: false,
    });
  }

  getUserByEmail(email as string)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ error: "User not found", data: undefined, success: false });
      }

      res.json(user);
    })
    .catch(() => {
      return res
        .status(500)
        .send({ error: "Server error", data: undefined, success: false });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
