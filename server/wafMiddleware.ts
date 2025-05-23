import { Request, Response, NextFunction } from "express";
const geoip = require("geoip-lite");

const patterns: RegExp[] = [
  /<script.*?>/i,
  /select\s.+\sfrom/i,
  /drop\s+table/i,
  /union\s+select/i,
];
const BLACKLISTED_IPS = new Set(["10.0.0.5"]);

function isIpBlacklisted(ip: string) {
  return BLACKLISTED_IPS.has(ip);
}
const ALLOWED_COUNTRIES = new Set(["US", "IN"]);

function isCountryAllowed(ip: string) {
  console.log(ip);
  const geo = geoip.lookup(ip);
  console.log(geo);
  if (!geo) return false;
  console.log(geo.country);
  return ALLOWED_COUNTRIES.has(geo.country);
}
const lastRequestTime = {};

function isBot(req: Request): boolean {
  const userAgent = (req.headers["user-agent"] as string) || "";
  if (!userAgent || userAgent.toLowerCase().includes("bot")) return true;

  const ip = req.ip;
  const now = Date.now();
  if (typeof ip === "string" && ip) {
    if (
      (lastRequestTime as Record<string, number>)[ip] &&
      now - (lastRequestTime as Record<string, number>)[ip] < 1000
    )
      return true; // 1 second
    (lastRequestTime as Record<string, number>)[ip] = now;
  }
  return false;
}
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
  const ip = req.ip || "";

  if (isIpBlacklisted(ip)) {
    res.status(403).send("Forbidden: Blacklisted IP");
    return;
  }
  if (!isCountryAllowed(ip)) {
    res.status(403).send("Forbidden: Country not allowed");
    return;
  }
  if (isBot(req)) {
    res.status(403).send("Forbidden: Bot detected");
    return;
  }
  next();
}
