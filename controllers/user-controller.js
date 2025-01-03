const { z } = require('zod')
const UserModel = require('../model/User')
const { usernameValidation } = require('../validators/checkUsername')


const UsernameQuerySchema = z.object({
    username: usernameValidation
})


const checkUsernameUnique = async (req, res) => {
    try {
        const result = UsernameQuerySchema.safeParse({ username: req.query.username })
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return res.status(200).json({
                success: false,
                message: usernameErrors?.length > 0
                    ? usernameErrors.join(', ')
                    : 'Invalid Query Parameters'
            })
        }

        const { username } = result.data
        // console.log('check in mongo', username)

        const user = await UserModel.findOne({ username })

        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'Username is unique'
            })
        }
        return res.status(400).json({
            success: false,
            message: 'Username is already taken'
        })

    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.query
        const user = await UserModel.findOne({ username })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'User found',
            user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const editUser = async (req, res) => {
    try {
        const { username, name, about, avatarUrl } = req.body

        const updatedUser = await UserModel.findOneAndUpdate(
            { username },
            { name, about, avatarUrl },
            { new: true }
        )

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            })
        }

        return res.status(200).json({
            success: true,
            message: 'User info updated',
            user: updatedUser
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const saveUserinMongo = async (req, res) => {
    try {
        const { name, username, email, isVerified } = req.body
        const existingUserVerifiedByUsername = await UserModel.findOne({ username })


        if (existingUserVerifiedByUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username is already taken'
            })
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({ email })

        if (existingUserVerifiedByEmail) {
            if (existingUserVerifiedByEmail.isVerified) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exist with this email'
                })
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: 'Complete your verification'
                })
            }
        }

        const newUser = new UserModel({
            name,
            username,
            email,
            isVerified,
            posts: []
        })

        await newUser.save()

        return res.status(201).json({
            success: true,
            message: 'User details saved in db',
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const getUserbyEmail = async (req, res) => {
    try {
        const { email } = req.query
        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'User found',
            user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

module.exports = { getUserByUsername, editUser, checkUsernameUnique, saveUserinMongo, getUserbyEmail }