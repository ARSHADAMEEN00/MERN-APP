import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import noteRoutes from "./routes/notes";
import userRoutes from "./routes/user";
import formRoutes from "./routes/form";

import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import cors from 'cors';
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";

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

const allowedOrigins = ['http://localhost:3001', 'https://osperb-notes.netlify.app'];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(options));

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/form", formRoutes);
app.use("/api/notes", requiresAuth, noteRoutes);

app.use((req, res, next) => {
  next(
    createHttpError(404, "Endpoint Not Found, you accessing an unknown url")
  );
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  // if (error instanceof Error) errorMessage = error.message;
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
