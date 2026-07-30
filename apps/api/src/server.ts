import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), "../../.env") });

import rememberHandler from "./functions/remember.js";
import recallHandler from "./functions/recall.js";
import discoverHandler from "./functions/discover.js";
import analyzeHandler from "./functions/analyze.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Express wrapper for Vercel-style handlers
const wrapHandler = (handler: any) => {
  return async (req: express.Request, res: express.Response) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

app.all("/remember", wrapHandler(rememberHandler));
app.all("/recall", wrapHandler(recallHandler));
app.all("/discover", wrapHandler(discoverHandler));
app.all("/analyze", wrapHandler(analyzeHandler));

app.listen(port, () => {
  console.log(`Kumo A2MCP Render server listening on port ${port}`);
});
