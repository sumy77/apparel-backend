import express, { type Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import indexRouter from "./routes/index";
import { validationErrorMiddleware } from "./middleware/validationError";

const app: Express = express();
const port = process.env.PORT ?? 9000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use("/", indexRouter);

app.use(validationErrorMiddleware);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
export default app;
