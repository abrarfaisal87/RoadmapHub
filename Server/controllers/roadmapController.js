import pool from "../config/db.js";

export const getAllRoadmapItems = async (req, res) => {
  try {
    //building the query to get all roadmap items along with votes, comments, catergory, and status
    //left join is used to get all roadmap items even if they have no votes or comments
    const query = `
        SELECT 
          roadmap_item.id,
          roadmap_item.title,
          roadmap_item.description,
          roadmap_item.category,
          roadmap_item.status,
          roadmap_item.created_at,

          COUNT(DISTINCT upvotes.id) AS upvotes,              --counts upvotes per item
          COUNT(DISTINCT comment.id) AS comment_count       --counts comments per item

        FROM roadmap_item

        LEFT JOIN upvotes ON roadmap_item.id = upvotes.roadmap_item_id    
        LEFT JOIN comment ON roadmap_item.id = comment.roadmap_item_id  

        GROUP BY roadmap_item.id
        ORDER BY roadmap_item.created_at DESC;
        `;

    const result =await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({ 
        success:false,
        error : "Failed to load roadmap items"
     });
  }
};





//logic for upvoting an item or removing upvote
export const toggleUpvoteRoadmapItem = async (req, res) => {
  const roadmapItemId = req.params.id;
  const userId = req.user.id; // user id from the auth middleware

  try {
    //checking if the user has already upvoted the item
    const check = await pool.query(
      `SELECT * FROM upvotes WHERE upvotes.users_id = $1 and upvotes.roadmap_item_id = $2`,
      [userId, roadmapItemId]
    );

    if(check.rows.length > 0){
      //since already voted, then remove it

      await pool.query(
        `DELETE FROM upvotes WHERE upvotes.users_id = $1 AND upvotes.roadmap_item_id = $2`,
        [userId, roadmapItemId]
      );

      return res.status(200).json({
        success: true,
        message:"Upvote removed",
        upvoted:false
      });


    }
    else{
      //not upvoted yet, so add the upvote
      await pool.query(
        `INSERT INTO upvotes (users_id,roadmap_item_id) VALUES ($1, $2)`,
        [userId, roadmapItemId]
      );

      return res.status(200).json({
        success: true,
        message:"Upvoted successfully",
        upvoted:true
      });
    }
  } catch (error) {
    console.error("toggole upvote error:",error);
    res.status(500).json({
      success: false,
      error: "Failed to toggle upvote",
    });
  }
}



//get distinct categories and status for filtering
export const getFilter = async (req,res)=>{
  try {
    const [statusResult, catergoryResult] = await Promise.all([
      pool.query(`SELECT DISTINCT status FROM roadmap_item`),
      pool.query(`SELECT DISTINCT category FROM roadmap_item`)
    ]);

    res.json({
      success:true,
      status:statusResult.rows.map(row=>row.status),
      category:catergoryResult.rows.map(row=>row.category)
    })
  } catch (error) {
     console.error("Error fetching filters:", err);
    res.status(500).json({ success: false, message: "Failed to fetch filters" });
  }
}


//get single roadmap item
export const getSingleRoadmap = async(req,res)=>{
  const id= req.params.id; 
  try {
      const result = await pool.query(
      `SELECT 
        roadmap_item.*,
        (SELECT COUNT(*) FROM upvotes WHERE roadmap_item_id = roadmap_item.id) AS upvote_count,
        (SELECT COUNT(*) FROM comment WHERE roadmap_item_id = roadmap_item.id) AS comment_count
       FROM roadmap_item
       WHERE roadmap_item.id = $1`,
      [id]
    );



     if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Roadmap not found" });
    }
    res.status(200).json({
      success: true,
      roadmap: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error fetching roadmap:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch roadmap item" });
  }
}