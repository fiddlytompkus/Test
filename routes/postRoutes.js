const express = require('express');
const PostController = require('./../Controller/postController');
const authController = require('./../Controller/authController');

const router = express.Router();

router
  .route('/')
  .get(PostController.getAllPost)
  .post(authController.protectAccess, PostController.CreatePost);

router.use(authController.protectAccess);
router
  .route('/:id')
  .get(PostController.getPostById)
  .patch(PostController.UpdatePost)
  .delete(PostController.DeleteOne);

module.exports = router;
