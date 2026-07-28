import express from 'express';
import discoverHandler from './apps/api/src/functions/discover.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('apps/api/.env') });

const app = express();
app.use(express.json());
app.post('/discover', async (req, res) => {
  try {
    await discoverHandler(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
app.listen(3003, () => console.log('Listening on 3003'));
