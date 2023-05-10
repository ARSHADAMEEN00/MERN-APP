import "dotenv/config"; //to access env 
import express from "express";
import noteRoutes from "./routes/notes";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import formRoutes from "./routes/form";
import * as staticRoutes from "./routes/root";

import morgan from "morgan";
import createHttpError from "http-errors";
import cors from 'cors';
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { authenticateUser } from "./middleware/verifyAuth";
import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";
import { corsOptions } from "./config/corsOption";
import { isAdminProtected } from "./middleware/adminProtected";

const app = express();

app.use(session({
  secret: env.JWT_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
  },
  rolling: true,
  store: MongoStore.create({
    mongoUrl: env.MONGO_CONNECTION_STRING,
  })
}))

app.use(logger)
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/user", authRoutes);
app.use("/api/form", formRoutes);
app.use("/api/notes", authenticateUser, noteRoutes);
app.use("/api/admin/user", authenticateUser, isAdminProtected, userRoutes);

//load html in backend 
// app.use(express.static("static"))
// app.use('/static', express.static(path.join(__dirname, "static")))

app.use('/static', staticRoutes.default)
app.all("*", staticRoutes.notFound)

app.use((req, res, next) => {
  next(
    createHttpError(404, "Endpoint Not Found, you accessing an unknown url")
  );
});

app.use(errorHandler)

export default app;