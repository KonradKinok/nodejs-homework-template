import express from "express";
import logger from "morgan";
import cors from "cors";
import colors from "colors";
import { contactsRouter } from "./routes/api/contactsApi.js";
import { usersRouter } from "./routes/api/userApi.js";
import passport from "./config/configPassport.js";
import {
  AVATARS_DIRECTORY,
  FAVICON_DIRECTORY,
} from "./config/configDirectory.js";
import { auth } from "./middlewares/auth.js";
console.log("Directory: ", AVATARS_DIRECTORY);
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
const logger1 = (req, res, next) => {
  const { method, originalUrl } = req;

  const date = new Date().toLocaleString();
  console.log(`[${date}] [${method}] - ${originalUrl} [app.js]`.yellow);

  next();
};

app.use(logger1);
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/avatars", express.static(AVATARS_DIRECTORY));
app.use("/api/", usersRouter);
app.use("/api/contacts", auth, contactsRouter);

app.get("/favicon.ico", (req, res) => {
  res.sendFile(FAVICON_DIRECTORY);
  console.log(`[app.js] sciezkaDoPlikuFavicon: ${FAVICON_DIRECTORY}`.bgWhite);
});

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const error = err.stack;
  console.error(error.bgRed, "[app.js]");
  res.status(500).json({ message: err.message });
});

export const startServer = (port) => {
  app
    .listen(port, () => {
      console.log(`[server] Server running on port ${port}`.bgWhite);
      console.log(`[server] http://localhost:${port}/api/contacts/ `.bgWhite);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(
          `Port ${port} is already in use. Trying a different port...`.red
        );
        startServer(port + 1);
      } else {
        console.error(err);
      }
    });
};
