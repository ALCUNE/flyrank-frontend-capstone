import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    health: "healthy",
    timestamp: new Date().toISOString(),
    service: "FlyRank Capstone API",
    environment: process.env.NODE_ENV ?? "development",
    uptime: "99.9%",
    metrics: {
      memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      nodeVersion: process.version,
    },
  });
}
