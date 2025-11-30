
import { AxiosResponse } from "axios";

import $api from "../http";
import { IProject } from "../models/IProject";
import { IProjectData } from "../models/IProjectData";

export default class ProjectService {
    static async createProject(name: string, json: object, visibility = "PRIVATE", previewImage?: string): Promise<AxiosResponse<IProject>> {
        return $api.post<IProject>("/projects", { name, json, visibility, previewImage });
    }

    static async fetchMyProjects(): Promise<AxiosResponse<IProject[]>> {
        return $api.get<IProject[]>("/projects");
    }

    static async getPublicProjects(): Promise<AxiosResponse<IProject[]>> {
        return $api.get<IProject[]>('/projects/public');
    }

    static async rateProject(projectId: string, stars: number): Promise<AxiosResponse<IProject>> {
        return $api.post<IProject>(`/projects/${projectId}/rate`, { stars });
    }

    static async getProjectById(id: string): Promise<AxiosResponse<IProjectData>> {
        return $api.get<IProjectData>(`/projects/${id}`);
    }
    
    static async updateProject(id: string, json: object, visibility?: string, previewImage?: string): Promise<AxiosResponse<IProject>> {
        return $api.put<IProject>(`/projects/${id}`, { json, visibility, previewImage });
    }

    static async deleteProject(id: string): Promise<any> {
        return $api.delete(`/projects/${id}`);
    }

    static async toggleFavorite(projectId: string): Promise<AxiosResponse<string[]>> {
        return $api.post<string[]>(`/projects/${projectId}/favorite`);
    }

    static async addComment(projectId: string, text: string): Promise<AxiosResponse<any>> {
        return $api.post(`/projects/${projectId}/comment`, { text });
    }

    static async getComments(projectId: string): Promise<AxiosResponse<any[]>> {
        return $api.get<any[]>(`/projects/${projectId}/comments`);
    }

    static async deleteMyComment(commentId: string): Promise<any> {
        return $api.delete(`/projects/comments/${commentId}`);
    }

    // Admin functions

    static async deleteAnyComment(commentId: string): Promise<any> {
        return $api.delete(`/projects/comments/${commentId}/admin`);
    }

    static async fetchAllProjects(): Promise<AxiosResponse<IProject[]>> {
        return $api.get<IProject[]>("/projects/admin/projects");
    }
    static async deleteAnyProject(id: string): Promise<any> {
        return $api.delete(`/projects/admin/projects/${id}`);
    }
}