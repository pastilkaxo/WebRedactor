import React, { useEffect, useState, useContext } from "react";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SendIcon from "@mui/icons-material/Send";
import {
    Box, Grid, Card, CardMedia, CardContent, Typography, CardActionArea,
    Dialog, DialogContent, CircularProgress, Alert, Rating, Stack
, IconButton, TextField, List, ListItem, ListItemText, Divider } from "@mui/material";
import { observer } from "mobx-react-lite";

import { Context } from "../../..";
import { IComment } from "../../../models/IComment";
import { IProject } from "../../../models/IProject";
import ProjectService from "../../../Services/ProjectService";

const Storage: React.FC = () => {
    const { store } = useContext(Context);
    const [projects, setProjects] = useState<IProject[]>([]);
    const [comments, setComments] = useState<IComment[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const [openPreview, setOpenPreview] = useState(false);
    const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

    useEffect(() => {
        fetchPublicProjects();
    }, []);

    const fetchPublicProjects = async () => {
        try {
            setLoading(true);
            const response = await ProjectService.getPublicProjects();
            //const publicProjects = response.data.filter(p => p.owner !== store.user.id);
            setProjects(response.data);
        } catch (e: any) {
            setError(e.response?.data?.message || "Ошибка при загрузке проектов");
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
        alert("Не удалось загрузить комментарии");
      }
    };
  
  const handleToggleFavorite = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    try {
      const response = await ProjectService.toggleFavorite(projectId);
      store.user.favorites = response.data;
      setProjects([...projects]);
    } catch (e) {
      alert("Не удалось обновить избранное");
    }
  }
  
  const handleSendComment = async () => {
    if (!selectedProject || newComment.trim() === "") return;
    try {
      const response = await ProjectService.addComment(selectedProject._id, newComment);
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (e) {
      alert("Не удалось отправить комментарий");
    }
  }
    
    const handleDeleteMyComment = async (commentId: string) => {
        try {
            await ProjectService.deleteMyComment(commentId);
            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (e) {
            alert("Не удалось удалить комментарий");
        }
    };

    const handleDeleteAnyComment = async (commentId: string) => {
        try {
            await ProjectService.deleteAnyComment(commentId);
            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (e) {
            alert("Не удалось удалить комментарий");
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
          fetchPublicProjects();
        } catch (e: any ) {
            alert(`${e.response?.data?.message || "Не удалось поставить оценку"}`);
        }
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
    }

    if (error) {
        return <Box mt={2}><Alert severity="error">{error}</Alert></Box>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <Box sx={{ 
                flexGrow: 1, 
                p: 3, 
                backgroundColor: "rgba(0, 0, 0, 0.34)", 
                borderRadius: 2, 
                boxShadow: 3
            }}>
                <Typography  variant="h4" gutterBottom component="div" sx={{ mb: 3, textAlign: "center",fontWeight:"bold", color: "white" }}>
                    Публичная галерея
                </Typography>

                <Grid container spacing={3}>
                    {projects.map((project) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={project._id}>
                            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                <CardActionArea onClick={() => handleOpenPreview(project)}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={project.previewImage}
                                        alt={project.name}
                                    />
                                    <IconButton 
                                        onClick={(e) => handleToggleFavorite(e, project._id)}
                                        color="error"
                                        sx={{ position: "absolute", top: 5, right: 5, zIndex: 10, bgcolor: "rgba(255,255,255,0.7)" }}
                                    >
                                        {store.user.favorites.includes(project._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                    </IconButton>
                                </CardActionArea>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="div" noWrap>
                                        {project.name || "Без названия"}
                                    </Typography>
                                    <Stack spacing={1}>
                                        <Typography variant="body2">Оцените работу:</Typography>
                                        <Rating
                                            name={`rating-${project._id}`}
                                            defaultValue={(project.stars || 0)} 
                                            onChange={(event, newValue) => {
                                                handleRateProject(project._id, newValue);
                                            }}
                                        />
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
                                        <Typography variant="body2">Средняя оценка:</Typography>
                                        <Typography variant="h6">{project.stars / project.ratedBy.length || 0}</Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Dialog open={openPreview} onClose={handleClosePreview} maxWidth="md" fullWidth>
                    <DialogContent sx={{ p: 0 }}>
                        {selectedProject && (
                            <>
                                <img 
                                    src={selectedProject.previewImage} 
                                    alt={selectedProject.name}
                                    style={{width: "100%", height: "auto", display: "block" }} 
                                />
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="h6">Комментарии</Typography>
                                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                                        <TextField 
                                            fullWidth size="small" 
                                            placeholder="Написать комментарий..." 
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                        />
                                        <IconButton onClick={handleSendComment} color="primary"><SendIcon /></IconButton>
                                    </Box>
                                    <List sx={{ maxHeight: 200, overflow: "auto" }}>
                                        {comments.map((c) => (
                                            <ListItem key={c._id} alignItems="flex-start">
                                                <ListItemText 
                                                    primary={c.author?.email + ` (${new Date(c.createdAt).toLocaleString()})`} 
                                                    secondary={c.text} 
                                                />
                                                {(c.author?._id === store.user.id) ? (
                                                    <IconButton edge="end" style={{fontSize:"15px"}} onClick={() => handleDeleteMyComment(c._id)} color="error">
                                                        Удалить
                                                    </IconButton>
                                                ) : store.user.roles.includes("ADMIN") ? (
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
        </div>
    );
};

export default observer(Storage);