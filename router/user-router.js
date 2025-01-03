const express = require('express')
const router = express.Router()

const {checkUsernameUnique, editUser, getUserByUsername, saveUserinMongo, getUserbyEmail} = require('../controllers/user-controller')

router
    .route('/check-username-unique')
    .get(checkUsernameUnique)

router
    .route('/edit-user')
    .post(editUser)

router
    .route('/get-user-by-username')
    .get(getUserByUsername)

router
    .route('/save-user-in-mongo')
    .post(saveUserinMongo)

router
    .route('/get-user-by-email')
    .get(getUserbyEmail)

module.exports = router