import mongoose from "mongoose";
import env from "../util/validateEnv";

export const dbConnection = () => {
    mongoose
        .connect(env.MONGO_CONNECTION_STRING, {
            // useNewUrlParser: true,
            // useCreateIndex: true,
            // useUnifiedTopology: true,
        })
        .then(() => {
            console.log("mongoose connection");
        })
        .catch(console.error);
}


// mongoose
//   .connect(env.MONGO_CONNECTION_STRING, {
//     // useNewUrlParser: true,
//     // useCreateIndex: true,
//     // useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("mongoose connection");
//     app.listen(port, () => {
//       console.log("Server running " + port);
//     });
//   })
//   .catch(console.error);