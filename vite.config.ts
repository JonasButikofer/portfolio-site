import fs from 'node:fs';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

/**
 * Dev-only content editor backend. `configureServer` only runs under
 * `vite dev` — it never executes during `vite build`, so the production
 * bundle and the deployed site get none of this. Reads/writes the actual
 * JSON content files on disk so edits made through /admin are real and
 * permanent, not a preview.
 */
function contentAdminPlugin(): Plugin {
  const siteContentPath = path.resolve(import.meta.dirname, 'src/data/site-content.json');
  const projectsContentPath = path.resolve(import.meta.dirname, 'src/data/projects-content.json');

  function readJson(filePath: string) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  function writeJson(filePath: string, data: unknown) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  }

  return {
    name: 'content-admin',
    configureServer(server) {
      server.middlewares.use('/__admin/api/content', (req, res) => {
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              site: readJson(siteContentPath),
              projects: readJson(projectsContentPath),
            }),
          );
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              writeJson(siteContentPath, parsed.site);
              writeJson(projectsContentPath, parsed.projects);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true }));
            } catch (err) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, error: String(err) }));
            }
          });
          return;
        }

        res.statusCode = 405;
        res.end();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), contentAdminPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});
