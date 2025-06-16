const UserModel = require('../model/User')

const addPost = async (req, res) => {
    try {
        const { username, postid, imageUrl, caption, timestamp } = req.body


        // console.log('add post backend route called')

        const user = await UserModel.findOne({ username })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        // console.log(username, postid, imageUrl, caption, timestamp)

        user.posts.push({ postid, caption, imageUrl, timestamp })
        await user.save()

        // console.log('this is user on backend', user)

        return res.status(201).json({
            success: true,
            message: 'Post added successfully',
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const deletePost = async (req, res) => {
    try {
        const { username, postid } = req.body
        const user = await UserModel.findOne({ username })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        user.posts = user.posts.filter(post => post.postid !== postid)
        await user.save()

        return res.status(200).json({
            success: true,
            message: 'Post deleted successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }

}

const getPosts = async (req, res) => {
    try {
        const users = await UserModel.find({})

        let allPosts = []
        users.forEach(user => {
            user.posts.forEach(post => {
                allPosts.push({
                    name: user.name,
                    postid: post.postid,
                    caption: post.caption,
                    imageUrl: post.imageUrl,
                    username: user.username,
                    timestamp: post.timestamp,
                    comments: post.comments,
                    likes: post.likes
                })
            })
        })

        allPosts = allPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

        return res.status(200).json({
            success: true,
            message: 'Got the posts',
            posts: allPosts
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const addComment = async (req, res) => {
    try {
        const { whose_post, postid, comment } = req.body

        const user = await UserModel.findOne({ username: whose_post })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const post = user.posts.find(post => post.postid === postid)
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            })
        }

        post.comments.push(comment)
        await user.save()

        return res.status(200).json({
            success: true,
            message: 'Comment added successfully',
            post
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const deleteComment = async (req, res) => {
    try {
        const { whose_post, postid, commentId } = req.body
        // console.log(whose_post, postid, commentId)


        const user = await UserModel.findOne({ username: whose_post })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const post = user.posts.find(post => post.postid === postid)
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            })
        }

        const commentIndex = post.comments.findIndex(comment => comment.commentId === commentId)
        if (commentIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            })
        }

        post.comments.splice(commentIndex, 1)
        await user.save()

        return res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const toggleLike = async (req, res) => {
    try {
        const { whose_post, postid, liker } = req.body

        const user = await UserModel.findOne({ username: whose_post })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const post = user.posts.find(post => post.postid === postid)

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            })
        }

        if (!post.likes) {
            post.likes = []
        }

        const likeIndex = post.likes.indexOf(liker)

        if (likeIndex === -1) {
            post.likes.push(liker)
        } else {
            post.likes.splice(likeIndex, 1)
        }

        await user.save()

        return res.status(200).json({
            success: true,
            message: 'Like toggled successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}


module.exports = { addPost, deletePost, getPosts, addComment, deleteComment, toggleLike }