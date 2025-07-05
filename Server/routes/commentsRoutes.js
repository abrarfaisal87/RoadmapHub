import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { createComment, deleteComment, getComments, updateComment } from '../controllers/commentsController.js';

const router = express.Router();

router.post('/:roadmapItemId', requireAuth, createComment);
router.get('/:roadmapItemId', getComments);
router.put('/:commentId', requireAuth, updateComment);
router.delete('/:commentId', requireAuth, deleteComment);

export default router;