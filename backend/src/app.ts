import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import noteRoutes from "./routes/notes";
import userRoutes from "./routes/user";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import cors from 'cors';
import session from "express-session";
import validateEnv from "./util/validateEnv";
import MongoStore from "connect-mongo";
const app = express();

const allowedOrigins = ['http://localhost:3001'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

app.use(session({
  secret: validateEnv.JWT_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 10000
  },
  rolling: true,
  store: MongoStore.create({
    mongoUrl: validateEnv.MONGO_CONNECTION_STRING,

  })
}))

app.use("/api/notes", noteRoutes);
app.use("/api/user", userRoutes);

app.use((req, res, next) => {
  next(
    createHttpError(404, "Endpoint Not Found, you accessing an unknown url")
  );
});

//for error handle
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
