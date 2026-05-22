import path from "path";
import Database from "better-sqlite3";

const dbPath = path.join(process.cwd(), "storage", "homedealio.sqlite");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

const now = new Date().toISOString();
const next30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

const seedDeals = [
  {
    title: "Aster 36\" Single Vanity with Quartz Top",
    slug: "aster-36-single-vanity-quartz",
    category: "vanity",
    topic: "36-inch-vanity-deals",
    store: "Wayfair",
    original_price: 1299,
    deal_price: 899,
    image_url: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1200&q=80",
    affiliate_url: "https://example.com/deals/aster-36",
    description: "Solid wood vanity with soft-close drawers and engineered quartz countertop.",
    highlights: "Soft-close drawers\nQuartz countertop included\nCountertop pre-drilled for faucet",
    tag: "Top pick",
    status: "published",
    published_at: now,
    expires_at: next30Days,
    updated_at: now,
    featured_home: 1,
    featured_topic: 1
  },
  {
    title: "Noble 48\" Double Sink Vanity",
    slug: "noble-48-double-sink-vanity",
    category: "vanity",
    topic: "double-sink-vanity-sale",
    store: "Home Depot",
    original_price: 1599,
    deal_price: 1149,
    image_url: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
    affiliate_url: "https://example.com/deals/noble-48",
    description: "Family-size double sink vanity with marble-look engineered top.",
    highlights: "Double basin included\nSoft-close doors\nPremium hardware finish",
    tag: "Family favorite",
    status: "published",
    published_at: now,
    expires_at: next30Days,
    updated_at: now,
    featured_home: 1,
    featured_topic: 1
  },
  {
    title: "Harbor 30\" Floating Vanity",
    slug: "harbor-30-floating-vanity",
    category: "vanity",
    topic: "vanity-deals",
    store: "Lowe's",
    original_price: 899,
    deal_price: 649,
    image_url: "https://images.unsplash.com/photo-1616594039964-3f5fd87d1d71?auto=format&fit=crop&w=1200&q=80",
    affiliate_url: "https://example.com/deals/harbor-30",
    description: "Space-saving wall-mounted vanity for compact bathrooms.",
    highlights: "Wall-mounted modern look\nMoisture-resistant finish\nEasy-clean sink basin",
    tag: "Small space",
    status: "published",
    published_at: now,
    expires_at: next30Days,
    updated_at: now,
    featured_home: 1,
    featured_topic: 0
  },
  {
    title: "Elm 60\" Double Vanity in Walnut",
    slug: "elm-60-double-vanity-walnut",
    category: "vanity",
    topic: "double-sink-vanity-sale",
    store: "Overstock",
    original_price: 2099,
    deal_price: 1549,
    image_url: "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?auto=format&fit=crop&w=1200&q=80",
    affiliate_url: "https://example.com/deals/elm-60",
    description: "Large-format double vanity with rich walnut finish and ceramic sinks.",
    highlights: "60-inch wide cabinet\nDual ceramic sinks\nStrong storage capacity",
    tag: "Premium",
    status: "published",
    published_at: now,
    expires_at: next30Days,
    updated_at: now,
    featured_home: 0,
    featured_topic: 1
  },
  {
    title: "Nova 24\" Budget Vanity Combo",
    slug: "nova-24-budget-vanity-combo",
    category: "vanity",
    topic: "under-1000",
    store: "Amazon",
    original_price: 499,
    deal_price: 329,
    image_url: "https://images.unsplash.com/photo-1625986202032-67f8a0f7f7a0?auto=format&fit=crop&w=1200&q=80",
    affiliate_url: "https://example.com/deals/nova-24",
    description: "Entry-level vanity set with sink and mirror for value-focused buyers.",
    highlights: "Great for rentals\nMirror included\nEasy assembly",
    tag: "Under $500",
    status: "published",
    published_at: now,
    expires_at: next30Days,
    updated_at: now,
    featured_home: 0,
    featured_topic: 0
  },
  {
    title: "CloudRest Hybrid Mattress Queen",
    slug: "cloudrest-hybrid-mattress-queen",
    category: "mattress",
    topic: "mattress-clearance",
    store: "Costco",
    original_price: 1099,
    deal_price: 749,
    image_url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    affiliate_url: "https://example.com/deals/cloudrest-queen",
    description: "Cooling gel hybrid mattress with medium-firm support profile.",
    highlights: "10-year warranty\nMotion isolation\nCooling top layer",
    tag: "Clearance",
    status: "published",
    published_at: now,
    expires_at: next30Days,
    updated_at: now,
    featured_home: 0,
    featured_topic: 0
  }
];

const total = db.prepare("SELECT COUNT(*) AS count FROM deals").get();
if (total.count > 0) {
  console.log(`Seed skipped: deals table already has ${total.count} row(s).`);
  db.close();
  process.exit(0);
}

const insert = db.prepare(`
  INSERT INTO deals (
    title, slug, category, topic, store,
    original_price, deal_price, image_url, affiliate_url,
    description, highlights, tag, status,
    published_at, expires_at, updated_at,
    featured_home, featured_topic
  ) VALUES (
    @title, @slug, @category, @topic, @store,
    @original_price, @deal_price, @image_url, @affiliate_url,
    @description, @highlights, @tag, @status,
    @published_at, @expires_at, @updated_at,
    @featured_home, @featured_topic
  )
`);

const txn = db.transaction((rows) => {
  for (const row of rows) insert.run(row);
});
txn(seedDeals);

db.close();
console.log(`Seed complete: inserted ${seedDeals.length} deals.`);
