import React, { useState, useContext, useEffect, useRef } from "react";

import { Button } from "blocksin-system"; 
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { 
    FloppyDiskIcon, 
    DownloadIcon, 
    UploadIcon,
    ChevronDownIcon 
} from "sebikostudio-icons";

import { SERIALIZATION_PROPS } from "./CanvasApp";
import { styles } from "./styles";
import { Context } from "../../../index";
import ProjectService from "../../../Services/ProjectService";

function FileExport({ canvas,isReadOnly }) {
    const { store } = useContext(Context);
    const { id: projectId } = useParams(); 

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [projectName, setProjectName] = useState("New Project");
    const [visibility, setVisibility] = useState("PRIVATE");
    const [isSaving, setIsSaving] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (projectId && isModalOpen && projectName === "New Project") {
            setProjectName(`Project ${projectId.substr(0, 6)}`); 
        }
    }, [projectId, isModalOpen]);


    const handleExportJson = () => {
        if (!canvas) return;
        setIsMenuOpen(false);
        const json = canvas.toJSON(SERIALIZATION_PROPS);
        json.width = canvas.width;
        json.height = canvas.height;
        const blob = new Blob([JSON.stringify(json)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${projectName.replace(/\s+/g, "_")}.json`;
        link.click();
    };

    const handleImportJsonClick = () => {
        const input = document.getElementById("json-upload-input");
        if (input) input.click();
        setIsMenuOpen(false);
    };

    const handleFileChange = (e) => { 
        if (!canvas) return;
        const file = e.target.files[0];
        if (file && file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = async () => { 
                try { 
                    const json = JSON.parse(reader.result);
                    canvas.clear();
                    await canvas.loadFromJSON(json);
                    if (json.width && json.height) {
                        canvas.setDimensions({
                            width: json.width,
                            height: json.height
                        });
                    }
                    canvas.requestRenderAll();
                    console.log("Canvas loaded successfully");
                } catch (err) {
                    console.error("Can't load canvas from json.", err);
                    alert("Error loading file");
                }
            }
            reader.readAsText(file);
        }
        e.target.value = null;
    }

    const handleOpenSaveDialog = () => {
        if (!store.isAuth) {
            alert("Please log in to save projects to the cloud.");
            setIsMenuOpen(false);
            return;
        }
        setProjectName(projectId ? `Project ${projectId.substr(0, 6)}` : "New Project");
        setIsModalOpen(true);
        setIsMenuOpen(false);
    };

    const handleSaveToCloud = async () => {
        if (!canvas) return;
        setIsSaving(true);
        try {
            const json = canvas.toJSON(SERIALIZATION_PROPS);
            json.width = canvas.width;
            json.height = canvas.height;
            
            const previewImage = canvas.toDataURL({
                format: 'png', 
                quality: 0.5,   
                width: canvas.width ,
                height: canvas.height,
            });

            if (projectId) {
                await ProjectService.updateProject(projectId, json, visibility, previewImage);
                alert("Project updated successfully!");
            } else {
                await ProjectService.createProject(projectName, json, visibility, previewImage);
                alert("Project saved successfully!");
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error saving project:", err);
            const msg = err.response?.data?.message || err.message || "Failed to save project.";
            alert(msg);
            if (msg.includes("too large") || (err.response && err.response.status === 413)) {
                alert("Project is too large to save! Try reducing image sizes or ask admin to increase server limit.");
            } else {
                alert(msg);
            }
        } finally {
            setIsSaving(false);
        }
    };


    if (isReadOnly) {
        return (
            <div className='FileExport'>
                <Button 
                    variant="ghost" 
                    size="small" 
                    onClick={handleExportJson} 
                    style={styles.mainButton}
                >
                    <DownloadIcon style={{marginRight: 5}}/> Download JSON
                </Button>
            </div>
        );
    }

    return (
        <div className='FileExport' style={{ position: "relative" , marginLeft:"10px"}} ref={menuRef}>
            
            {/* Кнопка открытия меню */}
            <Button 
                variant="ghost" 
                size="small" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={styles.mainButton}
            >
                File / Save
            </Button>

            {/* Выпадающее меню (Custom Dropdown) */}
            {isMenuOpen && (
                <div style={styles.dropdownMenu}>
                    <div style={styles.menuItem} onClick={handleOpenSaveDialog}>
                        <FloppyDiskIcon style={styles.icon} /> Save to Cloud
                    </div>
                    <div style={styles.menuItem} onClick={handleExportJson}>
                        <DownloadIcon style={styles.icon} /> Export to JSON
                    </div>
                    <div style={styles.menuItem} onClick={handleImportJsonClick}>
                        <UploadIcon style={styles.icon} /> Import JSON
                    </div>
                </div>
            )}

            {/* Скрытый инпут */}
            <input 
                id="json-upload-input"
                type='file' 
                accept='.json' 
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

            {/* Модальное окно (Custom Modal) */}
            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={styles.modalTitle}>
                            {projectId ? "Update Project" : "Save Project"}
                        </h3>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Project Name</label>
                            <input 
                                type="text" 
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                style={styles.input}
                                placeholder="Enter project name"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Visibility</label>
                            <select 
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value)}
                                style={styles.select}
                            >
                                <option value="PRIVATE">Private (Only Me)</option>
                                <option value="PUBLIC">Public (Anyone with link)</option>
                            </select>
                        </div>

                        <div style={styles.modalActions}>
                            <Button 
                                variant="secondary" 
                                onClick={() => setIsModalOpen(false)}
                                style={{ marginRight: "10px" }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="primary" 
                                onClick={handleSaveToCloud}
                                disabled={isSaving}
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


export default observer(FileExport);