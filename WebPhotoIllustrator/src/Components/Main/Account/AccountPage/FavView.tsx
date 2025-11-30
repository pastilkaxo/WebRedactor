import React, { useEffect, useState, useContext } from 'react';
import {
    Box, Grid, Card, CardMedia, CardContent, Typography, CardActionArea,
    Dialog, DialogContent, CircularProgress, Alert, Rating, Stack,
    IconButton, TextField, List, ListItem, ListItemText
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SendIcon from '@mui/icons-material/Send';
import { observer } from 'mobx-react-lite';

import { Context } from '../../../..';
import ProjectService from '../../../../Services/ProjectService';
import { IProject } from '../../../../models/IProject';
import { IComment } from '../../../../models/IComment';

const FavView: React.FC = () => {
    const { store } = useContext(Context);
    const [projects, setProjects] = useState<IProject[]>([]);
    const [comments, setComments] = useState<IComment[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [openPreview, setOpenPreview] = useState(false);
    const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

    useEffect(() => {
        fetchFavoriteProjects();
    }, [store.user.favorites]); 

    const fetchFavoriteProjects = async () => {
        try {
            setLoading(true);
            const response = await ProjectService.getPublicProjects();
            const favProjects = response.data.filter(p => store.user.favorites.includes(p._id));
            setProjects(favProjects);
        } catch (e: any) {
            setError(e.response?.data?.message || 'Ошибка при загрузке избранного');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenPreview = async (project: IProject) => {
        setSelectedProject(project);
        setOpenPreview(true);
        try {
            const response = await ProjectService.getComments(project._id);
            setComments(response.data);
        } catch (e) {
            alert('Не удалось загрузить комментарии');
        }
    };
  
    const handleToggleFavorite = async (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation();
        try {
            const response = await ProjectService.toggleFavorite(projectId);
            store.user.favorites = response.data;
            setProjects(projects.filter(p => p._id !== projectId));
        } catch (e) {
            alert('Не удалось обновить избранное');
        }
    }
  
    const handleSendComment = async () => {
        if (!selectedProject || newComment.trim() === '') return;
        try {
            const response = await ProjectService.addComment(selectedProject._id, newComment);
            setComments([response.data, ...comments]);
            setNewComment('');
        } catch (e) {
            alert('Не удалось отправить комментарий');
        }
    }
    
    const handleDeleteMyComment = async (commentId: string) => {
        try {
            await ProjectService.deleteMyComment(commentId);
            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (e) {
            alert('Не удалось удалить комментарий');
        }
    };

    const handleDeleteAnyComment = async (commentId: string) => {
        try {
            await ProjectService.deleteAnyComment(commentId);
            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (e) {
            alert('Не удалось удалить комментарий');
        }
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
        } catch (e: any) {
            alert(`${e.response?.data?.message || 'Не удалось поставить оценку'}`);
        }
    };

    if (loading && projects.length === 0) {
        return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
    }

    if (error) {
        return <Box mt={2}><Alert severity="error">{error}</Alert></Box>;
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom component="div" sx={{ mb: 3 }}>
                Избранные проекты
            </Typography>

            {projects.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    У вас пока нет избранных проектов.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {projects.map((project) => (
                        <Grid key={project._id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardActionArea onClick={() => handleOpenPreview(project)}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={project.previewImage || 'https://via.placeholder.com/300x200?text=No+Preview'}
                                        alt={project.name}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <IconButton 
                                        onClick={(e) => handleToggleFavorite(e, project._id)}
                                        color="error"
                                        sx={{ position: 'absolute', top: 5, right: 5, zIndex: 10, bgcolor: 'rgba(255,255,255,0.7)' }}
                                    >
                                        <FavoriteIcon /> 
                                    </IconButton>
                                </CardActionArea>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="div" noWrap>
                                        {project.name || 'Без названия'}
                                    </Typography>
                                    <Stack spacing={1}>
                                        <Typography variant="body2">Оцените работу:</Typography>
                                        <Rating
                                            name={`rating-${project._id}`}
                                            defaultValue={project.stars || 0} 
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
            )}

            <Dialog open={openPreview} onClose={handleClosePreview} maxWidth="md" fullWidth>
                <DialogContent sx={{ p: 0 }}>
                    {selectedProject && (
                        <>
                            <img 
                                src={selectedProject.previewImage || 'https://via.placeholder.com/800x600?text=No+Preview'} 
                                alt={selectedProject.name}
                                style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '70vh', objectFit: 'contain', backgroundColor: '#000' }} 
                            />
                            <Box sx={{ p: 2 }}>
                                <Typography variant="h6">Комментарии</Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <TextField 
                                        fullWidth size="small" 
                                        placeholder="Написать комментарий..." 
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <IconButton onClick={handleSendComment} color="primary"><SendIcon /></IconButton>
                                </Box>
                                <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                                    {comments.map((c) => (
                                        <ListItem key={c._id} alignItems="flex-start">
                                            <ListItemText 
                                                primary={`${c.author?.email || 'Пользователь'} (${new Date(c.createdAt).toLocaleString()})`} 
                                                secondary={c.text} 
                                            />
                                            {(c.author?._id === store.user.id) ? (
                                                <IconButton edge="end" style={{fontSize:"15px"}} onClick={() => handleDeleteMyComment(c._id)} color="error">
                                                    Удалить
                                                </IconButton>
                                            ) : store.user.roles.includes('ADMIN') ? (
                                                <IconButton edge="end" style={{fontSize:"15px"}} onClick={() => handleDeleteAnyComment(c._id)} color="error">
                                                    Удалить (админ)
                                                </IconButton>
                                            ) : null}
                                        </ListItem>
                                    ))}
                                                    </List>
                        </Box>
                    </>
                )}
            </DialogContent>
        </Dialog>
    </Box>
    );
};

export default observer(FavView);