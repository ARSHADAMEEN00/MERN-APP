import app from "./app";
import mongoose from "mongoose";
import env from "./util/validateEnv";

const port = env.PORT;

mongoose
  .connect(env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("mongoose connection");
    app.listen(port, () => {
      console.log("Server running " + port);
    });
  })
  .catch(console.error);
