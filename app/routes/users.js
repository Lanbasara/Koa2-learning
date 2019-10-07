const Router = require('koa-router')
const jwt = require('koa-jwt')
const UserCtl = require('../controllers/users')
const TopicsCtl = require('../controllers/topics')
const AnswersCtl = require('../controllers/answers')
const router = new Router({prefix : '/users'})
// const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../config')

const auth = jwt({ secret })

// JWT的手动实现
// const auth = async (ctx,next) => {
//     const {authorization = '' } = ctx.request.header
//     const token = authorization.replace("Bearer ",'');
//     try {
//         const user = jsonwebtoken.verify(token,secret)
//         ctx.state.user = user
//     } catch(err){
//         ctx.throw(401,err.messsage)
//     }
//     await next()
// }

router.get('/',UserCtl.index) 
router.post('/',UserCtl.insertUser)
router.get('/:id',UserCtl.getUserById)
router.get('/:id/following',UserCtl.listFollowing)
router.get('/:id/followers',UserCtl.listFollowers)
router.get('/:id/followingTopics',UserCtl.listFollowingTopics)
router.get('/:id/questions',UserCtl.listQuestion)
router.put('/following/:id',auth,UserCtl.checkUserExist,UserCtl.follow)
router.delete('/following/:id',auth,UserCtl.checkUserExist,UserCtl.unfollow)
router.put('/followingTopics/:id',auth,TopicsCtl.checkTopicExist,UserCtl.followTopics)
router.delete('/followingTopics/:id',auth,TopicsCtl.checkTopicExist,UserCtl.unfollowTopics)
router.patch('/:id',auth, UserCtl.checkOwner, UserCtl.changeUserInfo)
router.delete('/:id',auth, UserCtl.checkOwner, UserCtl.deleteUserbyId)
router.post('/login',UserCtl.login)
router.get('/:id/likingAnswers',UserCtl.listLikingAnswers)
router.get('/:id/dislikingAnswers',UserCtl.listdisLikingAnswers)
router.put('/likingAnswers/:id',auth, AnswersCtl.checkanswerExist,UserCtl.likeAnswer, UserCtl.undislikeAnswer)
router.delete('/likingAnswers/:id',auth,AnswersCtl.checkanswerExist,UserCtl.unlikeAnswer)
router.put('/dislikingAnswers/:id',auth, AnswersCtl.checkanswerExist,UserCtl.dislikeAnswer, UserCtl.unlikeAnswer)
router.delete('/dislikingAnswers/:id',auth,AnswersCtl.checkanswerExist,UserCtl.undislikeAnswer)
router.get('/:id/collectAnswers',UserCtl.listcollectingAnswers)
router.put('/collectAnswers/:id',auth, AnswersCtl.checkanswerExist,UserCtl.collectAnswers)
router.delete('/uncollectAnswers/:id',auth,AnswersCtl.checkanswerExist,UserCtl.uncollectAnswers)
module.exports = router