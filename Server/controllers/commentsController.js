import pool from "../config/db.js";

//create a comment
// POST /api/comments/:roadmapItemId
export const createComment = async (req, res) => {
  const userId = req.user.id;
  const roadmapItemId = req.params.roadmapItemId;
  const { text, parent_comment_id } = req.body;

  if (!text || text.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Comment text is required" });
  }

  try {
    let depth = 1;
    if (parent_comment_id) {
      let currentId = parent_comment_id;

      // Check if the parent comment exists
      while (currentId) {
        const result = await pool.query(
          `SELECT parent_comment_id FROM comment WHERE id = $1`,
          [currentId]
        );
        if (result.rows.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Parent comment not found" });
        }
        currentId = result.rows[0].parent_comment_id;
        depth++;
        if (depth > 3) {
          return res.status(400).json({
            success: false,
            message: "max nesting level of replies is 3",
          });
        }
      }
    }
    const insertQuery = `
  INSERT INTO comment (users_id,roadmap_item_id, parent_comment_id, text,created_at,updated_at)
  VALUES($1, $2, $3, $4, NOW(), NOW())
  RETURNING *
  `;
    const values = [userId, roadmapItemId, parent_comment_id || null, text];
    const result = await pool.query(insertQuery, values);
    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create comment",
    });
  }
};

// Get comments for a roadmap item
// GET /api/comments/:roadmapItemId
export const getComments = async (req, res) => {
  const roadmapItemId = req.params.roadmapItemId;

  try {
    const result = await pool.query(
      `SELECT
     comment.id,
     comment.users_id,
     comment.roadmap_item_id,
     comment.parent_comment_id,
     comment.text,
     comment.created_at,
     comment.updated_at,
     "users".email AS user_email
   FROM comment
   JOIN "users"
     ON comment.users_id = "users".id
   WHERE comment.roadmap_item_id = $1
   ORDER BY comment.created_at ASC`,
      [roadmapItemId]
    );

    const flatComments = result.rows;

    // Group comments by their ID
    const commentMap = new Map();
    flatComments.forEach((comment) => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    const nested = [];

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        nested.push(comment); // top-level comment
      }
    });

    res.json({
      success: true,
      comments: nested,
    });
  } catch (error) {
    console.error("❌ Error fetching comments:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    });
  }
};

//edit a comment
// PUT /api/comments/:commentId
export const updateComment = async (req, res) => {
  const userId = req.user.id;
  const commentId = req.params.commentId;
  const { text } = req.body;

  if (!text || text.trim === "") {
    return res
      .status(400)
      .json({ success: false, message: "Comment text is required" });
  }

  try {
    //checking ownership of the comment
    const check = await pool.query(`SELECT * FROM comment where id = $1`, [
      commentId,
    ]);

    if (check.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    const comment = check.rows[0];

    if (comment.users_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this comment",
      });
    }

    const updated = await pool.query(
      `UPDATE comment SET text = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [text, commentId]
    );

    res.json({
      success: true,
      message: "Comment updated successfully",
      comment: updated.rows[0],
    });
  } catch (error) {
    console.error("❌ Error updating comment:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update comment",
    });
  }
};

//delete a comment
// DELETE /api/comments/:commentId
export const deleteComment = async (req, res) => {
  const userId = req.user.id;
  const commentId = req.params.commentId;

  try {
    // Check if comment exists
    const result = await pool.query(`SELECT * FROM comment WHERE id = $1`, [
      commentId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const comment = result.rows[0];

    // Check if the logged-in user owns the comment
    if (comment.users_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment",
      });
    }

    // Delete the comment (nested ones will be deleted automatically)
    await pool.query(`DELETE FROM comment WHERE id = $1`, [commentId]);

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting comment:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    });
  }
};
