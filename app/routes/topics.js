const Router = require('koa-router')
const TopicsCtl = require('../controllers/topics')
const router = new Router({prefix : '/topics'})
const jwt = require('koa-jwt')
const { secret } = require('../config')
const auth = jwt({ secret })

router.get('/',TopicsCtl.find)
router.post('/',auth,TopicsCtl.creat) 
router.get('/:id',TopicsCtl.checkTopicExist,TopicsCtl.findById) 
router.patch('/:id',auth,TopicsCtl.checkTopicExist,TopicsCtl.update) 
router.get('/:id/topicfollowers', TopicsCtl.checkTopicExist,TopicsCtl.listTopicsFollowers) 
module.exports = router