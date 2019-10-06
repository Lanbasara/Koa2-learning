const Router = require('koa-router')
const QuestionsCtl = require('../controllers/question')
const router = new Router({prefix : '/questions'})
const jwt = require('koa-jwt')
const { secret } = require('../config')
const auth = jwt({ secret })

router.get('/',QuestionsCtl.find)
router.post('/',auth,QuestionsCtl.creat) 
router.get('/:id',auth,QuestionsCtl.checkQuestionExist,QuestionsCtl.findById) 
router.patch('/:id',auth,QuestionsCtl.checkQuestionExist,QuestionsCtl.checkQuestioner,QuestionsCtl.update)
router.delete('/:id',auth,QuestionsCtl.checkQuestionExist,QuestionsCtl.checkQuestioner,QuestionsCtl.delete)
// router.get('/:id/topicfollowers', QuestionsCtl.checkTopicExist,QuestionsCtl.listTopicsFollowers) 
module.exports = router