import { cleanEnv, port, str, } from "envalid";

export default cleanEnv(process.env, {
  MONGO_CONNECTION_STRING: str(),
  PORT: port(),
  NODE_ENV: str(),
  JWT_KEY: str(),
  REFRESH_JWT_KEY: str()
});
