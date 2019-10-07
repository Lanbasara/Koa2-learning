const Router = require('koa-router')
const AnswersCtl = require('../controllers/answers')
const router = new Router({prefix : '/questions/:questionId/answers'})
const jwt = require('koa-jwt')
const { secret } = require('../config')
const auth = jwt({ secret })

router.get('/',AnswersCtl.find)
router.post('/',auth,AnswersCtl.creat) 
router.get('/:id',auth,AnswersCtl.checkanswerExist,AnswersCtl.findById) 
router.patch('/:id',auth,AnswersCtl.checkanswerExist,AnswersCtl.checkanswerer,AnswersCtl.update)
router.delete('/:id',auth,AnswersCtl.checkanswerExist,AnswersCtl.checkanswerer,AnswersCtl.delete)
// router.get('/:id/topicfollowers', AnswersCtl.checkTopicExist,AnswersCtl.listTopicsFollowers) 
module.exports = router