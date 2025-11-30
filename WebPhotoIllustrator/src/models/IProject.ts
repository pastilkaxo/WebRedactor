import { IComment } from "./IComment";

export interface IProject {
    _id: string;
    name: string;
    s3Key: string;
    createdAt: string;
    updatedAt: string;
    visibility: 'PRIVATE' | 'PUBLIC';
    owner: string; 
    previewImage: string;
    ratedBy: string[];
    comments: IComment[]; 
    stars: number;
}
    