require('dotenv').config();
const { Mistral } = require("@mistralai/mistralai")
const ApiError = require('../Exceptions/api-error');

const mistral = new Mistral({
apiKey: process.env.OPENAI_API_KEY,});

class GptController{

    async generateText (req, res){
        try {
            const { text } = req.body;
            if (!text) {
                return res.status(400).json({ message: "Input text is required!" });
            }
            const openaiAPIKey = process.env.OPENAI_API_KEY;
            if (!openaiAPIKey) {
                return res.status(500).json({ message: "Mistral API key is missing!" });
            }

            const response = await mistral.chat.complete({
                model: "mistral-small-latest",
                messages: [
                    { role: "user", content: text }
                ]
            });


            const generatedText = response.choices[0]?.message?.content?.trim();
            if (!generatedText) {
                return res.status(500).json({ message: "Не удалось получить ответ от модели" });
            }
            res.json({generatedText})

        }
        catch(err){
            console.log(err.message);
            res.status(500).json({ message: "Ошибка при генерации текста" });
        }
    }

}

module.exports = new GptController();