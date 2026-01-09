-- Update all car locations to Sinoville, Pretoria
UPDATE cars 
SET location = 'Sinoville, Pretoria'
WHERE location IS NOT NULL OR location IS NULL;

-- Verify the update
SELECT id, make, model, location 
FROM cars 
ORDER BY make, model;
