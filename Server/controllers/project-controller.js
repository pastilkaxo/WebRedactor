const projectService = require('../service/project-service');

class ProjectController {
        async create(req, res, next) {
        try {
             const { name, json, visibility, previewImage } = req.body;
            const project = await projectService.createProject(req.user.id, name, json, visibility, previewImage);
            return res.json(project);
        } catch (e) {
            next(e);
        }
    }

    async getAll(req, res, next) {
        try {
            const projects = await projectService.getUserProjects(req.user.id);
            return res.json(projects);
        } catch (e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const projectData = await projectService.getProjectContent(id, req.user.id);
            return res.json(projectData);
        } catch (e) {
            next(e);
        }
    }
    
    async update(req, res, next) {
        try {
             const { id } = req.params;
             const { json, visibility, previewImage } = req.body;
             const project = await projectService.updateProject(id, req.user.id, json, visibility, previewImage);
             return res.json(project);
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await projectService.deleteProject(id, req.user.id);
            return res.json(result);
        } catch (e) {
            next(e);
        } 
    }
    
    async getAllPublicProjects(req, res, next) {
        try {
            const projects = await projectService.getAllPublicProjects();
            return res.json(projects);
        } catch (e) {
            next(e);
        }
    }

    async rateProject(req, res, next) {
        try {
            const { projectId } = req.params;
            const { stars } = req.body;
            await projectService.rateProject(projectId, req.user.id, stars);
            return res.json({ message: "Рейтинг обновлен" });
        } catch (e) {
            next(e);
        }
    }

    // admin only
    async getAllProjects(req, res, next) {
        try {
            const projects = await projectService.getAllProjects();
            return res.json(projects);
        } catch (e) {
            next(e);
        }
    }

    async deleteAnyProject(req, res, next) {
        try {
            const { id } = req.params;
            const result = await projectService.deleteAnyProject(id);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }


}

module.exports = new ProjectController();