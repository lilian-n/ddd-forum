import express, { Request, Response } from "express";
import { getUserById } from "./database/database";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/:id", (req: Request, res: Response) => {
  const id = req.params?.id ? parseInt(req.params.id) : null;

  if (!id) {
    res.send("Error fetching id");
    return;
  }

  getUserById(id)
    .then((user) => {
      if (!user) {
        res.send("Cannot find user");
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      res.send(`Get user by id failed, ${err}`);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
