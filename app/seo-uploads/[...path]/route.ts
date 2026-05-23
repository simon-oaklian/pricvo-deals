import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const ROOT = path.join(process.cwd(), "public", "seo-uploads");
const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

export async function GET(_request: Request, { params }: { params: { path: string[] } }) {
  const relativePath = params.path.join(path.sep);
  const filePath = path.normalize(path.join(ROOT, relativePath));
  if (!filePath.startsWith(ROOT + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const body = await fs.readFile(filePath);
    const contentType = TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
