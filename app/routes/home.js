const Router = require('koa-router')
const router = new Router()
const homeCtl = require('../controllers/home')
router.get('/',homeCtl.index)
router.post('/upload',homeCtl.upload)
module.exports = router;