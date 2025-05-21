import { Request, Response, NextFunction } from "express";

const patterns: RegExp[] = [
  /<script.*?>/i,
  /select\s.+\sfrom/i,
  /drop\s+table/i,
  /union\s+select/i,
];

export function wafMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const combined = `${req.originalUrl} ${JSON.stringify(
    req.query
  )} ${JSON.stringify(req.body)}`;
  for (const pattern of patterns) {
    if (pattern.test(combined)) {
      console.warn(`Blocked request from ${req.ip} - Pattern: ${pattern}`);
      res.status(403).send("Forbidden: Suspicious request detected.");
      return;
    }
  }
  next();
}
