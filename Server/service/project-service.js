const ProjectModel = require("../models/project-model");
const UserModel = require("../models/user-model");
const ApiError = require("../Exceptions/api-error");
const S3Service = require("../utils/s3.service");

class ProjectService {
    async createProject(userId, projectName, projectData,visibility = 'PRIVATE') {
const fileName = `${projectName}_${Date.now()}.json`;
    const s3Key = await S3Service.uploadJson(userId, projectData, fileName);
    const project = await ProjectModel.create({ name: projectName, s3Key, owner: userId, visibility });
        const user = await UserModel.findById(userId);
        if (user) {
            user.projects.push(project._id);
            await user.save();
        }

        return project;
    }

    async getProjectContent(projectId,userId) {
        const project = await ProjectModel.findById(projectId);
        if (!project) {
            throw ApiError.BadRequest("Проект не найден");
        }
        const isOwner = project.owner.toString() === userId;
        const isPublic = project.visibility === 'PUBLIC';
        
        if (!isOwner && !isPublic) {
             throw ApiError.Forbidden("Это приватный проект. У вас нет доступа.");
        }

        const content = await S3Service.getJson(project.s3Key);
        return {
            info: project,
            content: content,
            isOwner: isOwner
        };
    }

    async getUserProjects(userId) {
        const projects = await ProjectModel.find({ owner: userId }).sort({ updatedAt: -1 });
        return projects;
    }

    async deleteProject(projectId, userId) {
        const project = await ProjectModel.findById(projectId);
        if (!project) throw ApiError.BadRequest("Проект не найден");

        if (project.owner.toString() !== userId) {
            throw ApiError.Forbidden("Нет прав на удаление");
        }

        await S3Service.deleteFile(project.s3Key);

        await UserModel.updateOne({ _id: userId }, { $pull: { projects: projectId } });

        await ProjectModel.deleteOne({ _id: projectId });

        return { message: "Проект удален" };
    }

    async updateProject(projectId, userId, projectJson, visibility) {
        const project = await ProjectModel.findById(projectId);
        if (!project) throw ApiError.BadRequest("Проект не найден");
        
        if (project.owner.toString() !== userId) {
             throw ApiError.Forbidden("Вы не являетесь владельцем этого проекта");
        }
        await S3Service.uploadJson(userId, projectJson, project.s3Key);
            
        if (visibility) project.visibility = visibility;
        project.updatedAt = new Date();
        await project.save();
        return project;
    }


}


module.exports = new ProjectService();