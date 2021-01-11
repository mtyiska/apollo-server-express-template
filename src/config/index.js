import { config } from "dotenv";

const { parsed } = config();

export const {
  SECRET,
  PORT,
  MODE,
  IN_PROD = MODE !== "prod",
  DATABASE_URL,
  BASE_URL,
  APP_URL = `${BASE_URL}${PORT}`,
} = parsed;
