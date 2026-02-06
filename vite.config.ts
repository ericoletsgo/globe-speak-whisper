import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import https from "node:https";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),

    // ── Dev-only TTS proxy (mirrors the Vercel Edge Function) ──────────
    // Proxies /api/tts?tl=ko&q=... → Google Translate TTS, adding the
    // Referer header the browser can't set.  In production, the Vercel
    // Edge Function at api/tts.ts handles this instead.
    {
      name: "tts-proxy",
      configureServer(server) {
        server.middlewares.use("/api/tts", (req, res) => {
          const qs = new URL(req.url || "/", "http://localhost").searchParams;
          const tl = qs.get("tl");
          const q = qs.get("q");

          if (!tl || !q) {
            res.writeHead(400);
            res.end("Missing tl or q");
            return;
          }

          const googleUrl =
            `https://translate.google.com/translate_tts?ie=UTF-8` +
            `&tl=${encodeURIComponent(tl)}&client=tw-ob` +
            `&q=${encodeURIComponent(q)}` +
            `&total=1&idx=0&textlen=${q.length}&prev=input&ttsspeed=1`;

          https
            .get(
              googleUrl,
              {
                headers: {
                  "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                    "AppleWebKit/537.36 (KHTML, like Gecko) " +
                    "Chrome/120.0.0.0 Safari/537.36",
                  Referer: "https://translate.google.com/",
                },
              },
              (upstream) => {
                if (upstream.statusCode !== 200) {
                  res.writeHead(502);
                  res.end("Upstream TTS error");
                  return;
                }
                res.writeHead(200, {
                  "Content-Type": "audio/mpeg",
                  "Cache-Control": "public, max-age=86400",
                });
                upstream.pipe(res);
              },
            )
            .on("error", () => {
              res.writeHead(502);
              res.end("Proxy error");
            });
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
