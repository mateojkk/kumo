import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// Handlers
import analyzeHandler from './src/functions/analyze.js';
import discoverHandler from './src/functions/discover.js';
import profileHandler from './src/functions/profile.js';
import recallHandler from './src/functions/recall.js';
import registryHandler from './src/functions/registry.js';
import rememberHandler from './src/functions/remember.js';

const app = express();
app.use(cors());
app.use(express.json());

// Helper to adapt Vercel handler to Express
const adapt = (handler: any) => async (req: express.Request, res: express.Response) => {
  try {
    await handler(req, res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error", detail: String(err) });
    }
  }
};

app.post('/analyze', adapt(analyzeHandler));
app.post('/discover', adapt(discoverHandler));
app.get('/agent/:id', adapt(profileHandler));
app.post('/recall', adapt(recallHandler));
app.get('/registry', adapt(registryHandler));
app.post('/remember', adapt(rememberHandler));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});
