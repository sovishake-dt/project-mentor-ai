import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

import ideasRouter from './server/routes/ideas';
import projectRouter from './server/routes/project';
import mentorRouter from './server/routes/mentor';
import vivaRouter from './server/routes/viva';

dotenv.config();

async function startServer() {
  const app = express();

  // Render provides PORT automatically.
  // 3000 is used locally if PORT is not defined.
  const PORT = Number(process.env.PORT) || 3000;

  // Allow requests from the Firebase frontend.
  app.use(
    cors({
      origin: [
        'https://project-mentor-ai.web.app',
        'https://project-mentor-ai.firebaseapp.com',
        'http://localhost:5173',
        'http://localhost:3000',
      ],
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
    })
  );

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.use('/api/ideas', ideasRouter);
  app.use('/api/project', projectRouter);
  app.use('/api/mentor', mentorRouter);
  app.use('/api/viva', vivaRouter);

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  // Vite middleware in development
  // Static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');

    app.use(express.static(distPath));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});