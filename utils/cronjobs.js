const cron = require('node-cron')
const UserStoriesModel = require('../model/Stories')


const removeExpiredStories = async () => {
    const now = new Date()
    try {
        const removes = await UserStoriesModel.updateMany(
            {},
            // aggregation pipeline
            { $pull: { stories: { timestamp: { $lt: new Date(now - 12 * 60 * 60 * 1000) } } } }
        )
        // // console.log('this are the removed ones: ', removes)
        
    } catch (error) {
        // console.error('Error in removing expired stories :', error)
    }
}

const startCronJobs = () => {
    cron.schedule('0 * * * *', removeExpiredStories)
}

module.exports = startCronJobs