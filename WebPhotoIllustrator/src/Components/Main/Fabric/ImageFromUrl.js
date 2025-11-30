import React, { useState, useRef } from "react";

import { Button, Input, Flex, Separator } from "blocksin-system";
import { FabricImage } from "fabric";

function ImageTool({ canvas, showImageMenu }) { 
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState(""); 
    const fileInputRef = useRef(null);



    const addImageToCanvas = (img) => {
        if (!canvas) return;

        img.set({ 
            left: 100, 
            top: 100 
        });

        // Масштабирование
        if (canvas.width && canvas.height) {
            const scale = Math.min(
                (canvas.width - 50) / img.width,
                (canvas.height - 50) / img.height,
                1 
            );
            img.scale(scale < 1 ? scale : 0.5); 
        }

        canvas.add(img);
        canvas.centerObject(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        
        setUploadMessage("Uploaded");
        setTimeout(() => { setUploadMessage("") }, 3000);
        setLoading(false);
    }
    

    const addImageFromUrl = async () => {
        if (!canvas || !imageUrl) return;
        
        setLoading(true);
        setUploadMessage("Downloading...");
        
        const currentUrl = imageUrl;
        setImageUrl(""); 

        try {
            const img = await FabricImage.fromURL(currentUrl, {
                crossOrigin: "anonymous"
            });
            
            addImageToCanvas(img);
        } catch (error) {
            console.error("Failed to load image from URL:", error);
            setUploadMessage("Load failed!");
            setLoading(false);
        }
    };

    const handleLocalFileSelect = () => {
        fileInputRef.current.click();
    }
    
    const addImageFromFile = async (event) => {
        if (!canvas) return;

        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = async (f) => {
                const data = f.target.result;
                setLoading(true);
                setUploadMessage("Loading from file...");

                try {
                    const img = await FabricImage.fromURL(data);
                    img.set({ src: data });
                    addImageToCanvas(img);
                    event.target.value = null;
                }
                catch (error) {
                    console.error("Failed to load local file:", error);
                    setUploadMessage("Load failed!");
                    setLoading(false);
                }
            };

            reader.readAsDataURL(file);
        }
    }

    return (
        <Flex className='ImageTool CanvasSettings darkmode' gap={100} style={{ color:"white",padding: "10px", flexDirection: "column", display: showImageMenu ? "flex" : "none" }}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={addImageFromFile}
            />
            
            <h3>Add Image</h3>
            <Separator />
            
            <Button 
                onClick={handleLocalFileSelect}
                disabled={loading}
                variant="secondary"
                fullWidth
            >
                Add from Local File
            </Button>
            
            <Input
                fluid
                label="Image URL"
                placeholder="Paste image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button 
                onClick={addImageFromUrl} 
                disabled={!imageUrl || loading}
                variant="primary"
                fullWidth
            >
                {loading ? "Adding..." : "Add from URL"}
            </Button>
            
            {uploadMessage && (
                <div style={{ marginTop: 10, fontSize: 12, color: "#aaa" }}>
                    {uploadMessage}
                </div>
            )}
        </Flex>
    );
}

export default ImageTool;