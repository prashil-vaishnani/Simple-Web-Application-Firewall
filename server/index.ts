import express, { Request, Response } from "express";
import path from "path";
import { wafMiddleware } from "./wafMiddleware";
import rateLimit from "express-rate-limit";

const app = express();

// Basic rate limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter); // Apply globally (to all routes)

const PORT = process.env.PORT || 3000;
const staticPath = path.resolve(__dirname, "../../client/dist");
console.log("Serving static from:", staticPath);

app.use(express.static(staticPath));
app.use(express.json());
app.use(wafMiddleware);

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello from backend" });
});

// Catch-all route for SPA (after all other routes)
app.get("*", (req: Request, res: Response) => {
  const indexPath = path.join(staticPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(500).send("index.html not found");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
