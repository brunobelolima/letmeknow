CREATE TABLE IF NOT EXISTS visitors (
  visitor_id TEXT PRIMARY KEY,
  last_counted_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS visit_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT NOT NULL,
  counted_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_visit_events_time ON visit_events(counted_at);
