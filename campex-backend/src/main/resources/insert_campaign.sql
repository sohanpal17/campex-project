-- Insert default featured campaign (supports donations, sponsorships, events, etc.)
INSERT INTO campaigns (id, title, description, poster_url, is_active, created_at)
VALUES (1, 'Featured Campaign', 'Support our campus community initiatives and events.', '', true, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

-- Reset sequence if needed
SELECT setval('campaigns_id_seq', (SELECT MAX(id) FROM campaigns));
