import React, { useEffect, useState, useContext } from 'react';
import {
    Box, Grid, Card, CardMedia, CardContent, Typography, CardActionArea,
    Dialog, DialogContent, CircularProgress, Alert, Rating, Stack
} from '@mui/material';
import { Context } from '../../..';
import ProjectService from '../../../Services/ProjectService';
import { IProject } from '../../../models/IProject';

const Storage: React.FC = () => {
    const { store } = useContext(Context);
    const [projects, setProjects] = useState<IProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [openPreview, setOpenPreview] = useState(false);
    const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

    useEffect(() => {
        fetchPublicProjects();
    }, []);

    const fetchPublicProjects = async () => {
        try {
            setLoading(true);
            const response = await ProjectService.getPublicProjects();
            const publicProjects = response.data.filter(p => p.owner !== store.user.id);
            setProjects(publicProjects);
        } catch (e: any) {
            setError(e.response?.data?.message || 'Ошибка при загрузке проектов');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenPreview = (project: IProject) => {
        setSelectedProject(project);
        setOpenPreview(true);
    };

    const handleClosePreview = () => {
        setOpenPreview(false);
        setSelectedProject(null);
    };

    const handleRateProject = async (projectId: string, newValue: number | null) => {
        if (newValue === null) return;
        try {
            await ProjectService.rateProject(projectId, newValue);
          alert(`Вы поставили ${newValue} звезд!`);
          fetchPublicProjects();
        } catch (e) {
            alert('Не удалось оценить работу');
        }
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
    }

    if (error) {
        return <Box mt={2}><Alert severity="error">{error}</Alert></Box>;
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom component="div" sx={{ mb: 3 }}>
                Публичная галерея
            </Typography>

            <Grid container spacing={3}>
                {projects.map((project) => (
                    <Grid  key={project._id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardActionArea onClick={() => handleOpenPreview(project)}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={project.previewImage}
                                    alt={project.name}
                                />
                            </CardActionArea>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h6" component="div" noWrap>
                                    {project.name || 'Без названия'}
                                </Typography>
                                <Stack spacing={1}>
                                    <Typography variant="body2">Оцените работу:</Typography>
                                    <Rating
                                        name={`rating-${project._id}`}
                                        defaultValue={0}
                                        onChange={(event, newValue) => {
                                            handleRateProject(project._id, newValue);
                                        }}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openPreview} onClose={handleClosePreview} maxWidth="md" fullWidth>
                <DialogContent sx={{ p: 0 }}>
                    {selectedProject && (
                        <img 
                            src={selectedProject.previewImage} 
                            alt={selectedProject.name}
                            style={{width: '100%', height: 'auto', display: 'block' }} 
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Storage;