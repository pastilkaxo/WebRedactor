import React, { useContext, useEffect, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { Context } from "../../../../index";
import { IProject } from "../../../../models/IProject";
import ProjectService from "../../../../Services/ProjectService";


function ProjectsView() {
  const { store } = useContext(Context);
  const [projects, setProjects] = useState<IProject[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (store.isAuth) {
      fetchProjects();
    }
  }, [store.isAuth]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await ProjectService.fetchMyProjects();
      setProjects(response.data);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Вы уверены, что хотите удалить этот проект?")) {
        try {
            await ProjectService.deleteProject(id);
            setProjects(projects.filter(p => p._id !== id));
        } catch (e) {
            alert("Ошибка при удалении");
        }
    }
  }
  
  const handleOpenProject = (id: string) => {
    navigate(`/editor/${id}`);
  }

  return (
    <Box sx={{ flex: 1, width: "100%", bgcolor: "#f5f5f5", minHeight: "100vh", pb: 5 }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
          Мои проекты
        </Typography>

        {loading ? (
          <Typography>Загрузка...</Typography>
        ) : projects.length === 0 ? (
          <Typography color="text.secondary">У вас пока нет проектов. Создайте новый в редакторе!</Typography>
        ) : (
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid   key={project._id}>
                <Card 
                    sx={{ 
                        height: "100%", 
                        display: "flex", 
                        flexDirection: "column",
                        transition: "0.3s",
                        "&:hover": { boxShadow: 6, cursor: "pointer" }
                    }}
                    onClick={() => handleOpenProject(project._id)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 1 }}>
                        <Typography variant="h6" component="div" noWrap>
                        {project.name}
                        </Typography>
                        <Chip 
                            label={project.visibility === "PUBLIC" ? "Public" : "Private"} 
                            color={project.visibility === "PUBLIC" ? "success" : "default"} 
                            size="small" 
                            variant="outlined"
                        />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Создано: {new Date(project.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Обновлено: {new Date(project.updatedAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" startIcon={<EditIcon />}>Открыть</Button>
                    <Button 
                        size="small" 
                        color="error" 
                        startIcon={<DeleteIcon />} 
                        onClick={(e) => handleDelete(project._id, e)}
                    >
                        Удалить
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}

export default observer(ProjectsView);