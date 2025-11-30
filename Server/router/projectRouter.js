const Router = require('express');
const projectController = require('../controllers/project-controller');
const authMiddleware = require("../middlewares/auth-middleware");
const roleMiddleware = require("../middlewares/role-middleware");
const router = new Router();

router.get('/public', projectController.getAllPublicProjects);
router.get('/admin/projects', authMiddleware,roleMiddleware(["ADMIN"]), projectController.getAllProjects); 
router.post('/', authMiddleware, projectController.create);
router.get('/', authMiddleware, projectController.getAll);
router.get('/:id', authMiddleware, projectController.getOne);
router.put('/:id', authMiddleware, projectController.update);
router.delete('/:id', authMiddleware, projectController.delete);
router.post('/:projectId/rate', authMiddleware, projectController.rateProject);
router.delete('/admin/projects/:id', authMiddleware,roleMiddleware(["ADMIN"]), projectController.deleteAnyProject); 



module.exports = router;