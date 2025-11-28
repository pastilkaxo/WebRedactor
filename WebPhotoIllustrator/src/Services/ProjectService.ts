
import $api from "../http";
import { AxiosResponse } from 'axios';
import { IProject } from "../models/IProject";
import { IProjectData } from "../models/IProjectData";

export default class ProjectService {
    static async createProject(name: string, json: object, visibility: string = 'PRIVATE'): Promise<AxiosResponse<IProject>> {
        return $api.post<IProject>('/projects', { name, json, visibility });
    }

    static async fetchMyProjects(): Promise<AxiosResponse<IProject[]>> {
        return $api.get<IProject[]>('/projects');
    }

    static async getProjectById(id: string): Promise<AxiosResponse<IProjectData>> {
        return $api.get<IProjectData>(`/projects/${id}`);
    }
    
    static async updateProject(id: string, json: object, visibility?: string): Promise<AxiosResponse<IProject>> {
        return $api.put<IProject>(`/projects/${id}`, { json, visibility });
    }

    static async deleteProject(id: string): Promise<any> {
        return $api.delete(`/projects/${id}`);
    }
}