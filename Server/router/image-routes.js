const Router = require("express");
const router = new Router();
const authMiddleware = require('../middlewares/auth-middleware');
const imageAccess = require('../middlewares/image-access-middleware');
const controller = require('../controllers/image-controller');


router.post('/', authMiddleware, controller.create);

router.get('/:id', imageAccess, controller.get);

router.patch('/:id', imageAccess, controller.update);

router.delete('/:id', imageAccess, controller.delete);

router.post('/:id/visibility', imageAccess, controller.setVisibility);

router.post('/:id/share', imageAccess, controller.share);

router.get('/:id/url', imageAccess, controller.getUrl);

module.exports = router;