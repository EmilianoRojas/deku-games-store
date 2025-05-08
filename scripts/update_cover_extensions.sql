-- Update all cover_image URLs from .png to .jpg
UPDATE public.account_transactions
SET cover_image = REPLACE(cover_image, '.png', '.jpg')
WHERE cover_image LIKE '%.png';

-- Show the number of updated rows
SELECT COUNT(*) as updated_rows
FROM public.account_transactions
WHERE cover_image LIKE '%.jpg'; 