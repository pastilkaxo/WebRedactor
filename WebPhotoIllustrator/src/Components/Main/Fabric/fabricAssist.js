import React,{useState,useContext} from "react"

import { Input, Flex, Button } from "blocksin-system";
import {Textbox} from "fabric"
import {SparklesIcon} from "sebikostudio-icons"

import {Context} from "../../../index";

function FabricAssist({ canvas }) {
    const [inputText, setInputText] = useState("");
    const { store } = useContext(Context);
    const handleGenerage = async (e) => {
        e.preventDefault();
        setInputText("");
        if (!inputText) {
            console.log("inputText is null"); // error alert need!
            return;
        }
        try {
            const response = await store.generateText(inputText);
            const openAIresponse = response.generatedText
            const textObj = new Textbox(openAIresponse, {
                top: 150,
                left: 150,
                width: 200,
                fontSize:20,
                fill: "#333",
                lockScalingFlip: true,
                editable: true,
                lockSclingX: false,
                lockScalingY: false,
                fontFamily: "OpenSans",
                textAlign: "left",
            });

            canvas.add(textObj);
            canvas.rednerAll();
        }
        catch(err) {
            console.log(err.message);
        }
    }
    return (    
        <Flex className="AI" gap={100} style={{marginBottom:10}}>
            <Input  className="darkmode" type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Type a prompt" label="Fabric Assist" />
            <Button onClick={handleGenerage}>
                <SparklesIcon/> Generate
            </Button>
      </Flex>
  )
}

export default FabricAssist