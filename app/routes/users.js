const Router = require('koa-router')
const jwt = require('koa-jwt')
const UserCtl = require('../controllers/users')
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
router.put('/following/:id',auth,UserCtl.checkUserExist,UserCtl.follow)
router.delete('/following/:id',auth,UserCtl.checkUserExist,UserCtl.unfollow)
router.patch('/:id',auth, UserCtl.checkOwner, UserCtl.changeUserInfo)
router.delete('/:id',auth, UserCtl.checkOwner, UserCtl.deleteUserbyId)
router.post('/login',UserCtl.login)
module.exports = router