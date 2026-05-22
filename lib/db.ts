import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const storageDir = path.join(process.cwd(), "storage");
const dbPath = path.join(storageDir, "homedealio.sqlite");

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  -- deals.category application values (not enforced by DB):
  -- vanity (浴室柜), mirror (浴室镜), faucet (水龙头), lighting (灯具),
  -- accessory (配件), mattress (床垫; legacy / may remove later)
  CREATE TABLE IF NOT EXISTS deals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    topic TEXT NOT NULL,
    store TEXT NOT NULL,
    original_price REAL NOT NULL,
    deal_price REAL NOT NULL,
    image_url TEXT NOT NULL,
    affiliate_url TEXT NOT NULL,
    description TEXT NOT NULL,
    highlights TEXT NOT NULL DEFAULT '',
    tag TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    published_at TEXT,
    expires_at TEXT,
    updated_at TEXT NOT NULL,
    featured_home INTEGER NOT NULL DEFAULT 0,
    featured_topic INTEGER NOT NULL DEFAULT 0,
    ai_generated INTEGER NOT NULL DEFAULT 0,
    reviewer_note TEXT NOT NULL DEFAULT '',
    source_url TEXT NOT NULL DEFAULT '',
    retailer_region TEXT NOT NULL DEFAULT 'US'
  );

  CREATE INDEX IF NOT EXISTS idx_deals_slug ON deals(slug);
  CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
  CREATE INDEX IF NOT EXISTS idx_deals_category ON deals(category);
  CREATE INDEX IF NOT EXISTS idx_deals_topic ON deals(topic);
`);

function tryAlter(sql: string) {
  try {
    db.exec(sql);
  } catch {
    /* column may already exist */
  }
}

tryAlter(`ALTER TABLE deals ADD COLUMN ai_generated INTEGER NOT NULL DEFAULT 0`);
tryAlter(`ALTER TABLE deals ADD COLUMN reviewer_note TEXT NOT NULL DEFAULT ''`);
tryAlter(`ALTER TABLE deals ADD COLUMN source_url TEXT NOT NULL DEFAULT ''`);
tryAlter(`ALTER TABLE deals ADD COLUMN retailer_region TEXT NOT NULL DEFAULT 'US'`);
