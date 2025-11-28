const Router = require('express');
const projectController = require('../controllers/project-controller');
const authMiddleware = require("../middlewares/auth-middleware");
const router = new Router();

router.post('/', authMiddleware, projectController.create);
router.get('/', authMiddleware, projectController.getAll);
router.get('/:id', authMiddleware, projectController.getOne);
router.put('/:id', authMiddleware, projectController.update);
router.delete('/:id', authMiddleware, projectController.delete);

module.exports = router;