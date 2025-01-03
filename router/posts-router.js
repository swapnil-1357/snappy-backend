const express = require('express')
const router = express.Router()

const {addPost, addComment, getPosts, deletePost, deleteComment, toggleLike} = require('../controllers/post-controller')

router
    .route('/get-posts')
    .get(getPosts)

router
    .route('/add-post')
    .post(addPost)

router
    .route('/add-comment')
    .post(addComment)

router
    .route('/delete-post')
    .delete(deletePost)

router
    .route('/delete-comment')
    .delete(deleteComment)

router
    .route('/toggle-like')
    .post(toggleLike)


module.exports = router