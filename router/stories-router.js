const express = require('express')
const { deleteStory, postStory, getStories } = require('../controllers/story-controller')
const router = express.Router()


router
    .route('/get-stories')
    .get(getStories)

router
    .route('/post-story')
    .post(postStory)

router
    .route('/delete-story')
    .delete(deleteStory)

module.exports = router