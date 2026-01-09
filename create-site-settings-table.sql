-- Create site_settings table for global application settings
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY,
  widget_type TEXT NOT NULL DEFAULT 'chatbot' CHECK (widget_type IN ('chatbot', 'whatsapp')),
  whatsapp_number TEXT NOT NULL DEFAULT '0608579146',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings (public access)
CREATE POLICY "Allow public read access"
ON site_settings FOR SELECT
USING (true);

-- Only authenticated users can update settings
CREATE POLICY "Allow authenticated users to update"
ON site_settings FOR UPDATE
TO authenticated
USING (true);

-- Only authenticated users can insert settings
CREATE POLICY "Allow authenticated users to insert"
ON site_settings FOR INSERT
TO authenticated
WITH CHECK (true);

-- Insert default settings
INSERT INTO site_settings (id, widget_type, whatsapp_number, updated_at)
VALUES ('global_settings', 'chatbot', '0608579146', NOW())
ON CONFLICT (id) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_settings_id ON site_settings(id);
