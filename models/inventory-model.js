const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    );
    return data.rows;
  } catch (error) {
    console.error("getClassifications error " + error);
  }
}

async function getClassificationByName(classification_name) {
  try {
    // This will get a classification from the database, case insensitive
    const data = await pool.query(
      "SELECT * FROM public.classification WHERE classification_name ~~* $1",
      [classification_name]
    );
    return data.rows[0];
  } catch (error) {
    console.error('getClassificationByName error ' + error);
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

async function getInventoryById(invId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      WHERE i.inv_id = $1`,
      [invId]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getInventoryById error " + error);
  }
}

async function createClassification(classification_name) {
  try {
    const data = await pool.query(
      `INSERT INTO public.classification (classification_name) VALUES ($1)`,
      [classification_name]
    );
    return data.rows;
  } catch (error) {
    console.error("createClassification error " + error);
  }
}

async function createInventory(inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id) {
  try {
    const data = await pool.query(
      `INSERT INTO public.inventory (inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("createInventory error " + error);
  }
}

async function updateInventory(inv_id,inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id) {
  try {
    const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ])
    return data.rows[0];
  } catch (error) {
    console.error("updateInventory error " + error);
  }
}

async function deleteInventory(inv_id) {
  try {
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    console.error("deleteInventory error " + error);
  }
}

async function getReviewsWithNamesByInvId(inv_id) {
  try {
    const sql = `
      SELECT 
        r.review_id,
        to_char(r.review_date, 'DD MON YYYY') AS review_date,
        r.review_text,
        r.review_stars,
        a.account_id,
        a.account_firstname,
        a.account_lastname
      FROM public.review r
      INNER JOIN public.account a
        ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC`;
    const data = await pool.query(sql, [inv_id]);
    return data.rows;
  } catch (error) {
    console.error('getReviewsWithNamesByInvId error ' + error);
  }
}

async function getReviewById(review_id) {
  try {
    const data = await pool.query(`
      SELECT 
          r.review_id,
          to_char(r.review_date, 'DD MON YYYY') AS review_date,
          r.review_text,
          r.review_stars,
          i.inv_make,
          i.inv_model,
          i.inv_id
      FROM public.review r
      INNER JOIN public.inventory i
          ON i.inv_id=r.inv_id
      WHERE review_id = $1`,
      [review_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error('getReviewById error ' + error);
  }
}

async function addReview(inv_id, account_id, review_text, review_stars) {
  try {
    const sql = "INSERT INTO public.review (inv_id, account_id, review_text, review_stars, review_date) VALUES ($1, $2, $3, $4, NOW())";
    const data = await pool.query(sql, [inv_id, account_id, review_text, review_stars]);
    return data.rows;
  } catch (error) {
    console.error('addReview error ' + error);
  }
}

async function updateReview(review_id, review_text, review_stars) {
  try {
    const sql = "UPDATE public.review SET review_text = $1, review_stars = $2 WHERE review_id = $3 RETURNING *";
    const data = await pool.query(sql, [review_text, review_stars, review_id]);
    return data.rows[0];
  } catch (error) {
    console.error('updateReview error ' + error);
  }
}

async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM public.review WHERE review_id = $1";
    const data = await pool.query(sql, [review_id]);
    return data;
  } catch (error) {
    console.error('deleteReview error ' + error);
  }
}


module.exports = { 
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  createClassification,
  createInventory,
  updateInventory,
  deleteInventory,
  getClassificationByName,
  getReviewsWithNamesByInvId,
  addReview,
  getReviewById,
  updateReview,
  deleteReview,
};