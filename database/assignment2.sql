INSERT INTO public.account
	(account_firstname,account_lastname,account_email,account_password)
VALUES
	('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE public.account SET account_type = 'Admin'::account_type WHERE account_id = 1;

DELETE FROM public.account WHERE account_id = 1;

UPDATE public.inventory SET inv_description=REPLACE(inv_description, 'the small interiors', 'a huge interior') WHERE inv_make='GM' AND inv_model='Hummer';

SELECT i.inv_make,i.inv_model FROM public.inventory i INNER JOIN classification c USING(classification_id) WHERE c.classification_name='Sport';

UPDATE public.inventory SET inv_image=REPLACE(inv_image, '/images/', '/images/vehicles/');

