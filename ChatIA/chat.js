const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const fs = require("fs");

require('dotenv').config();

const API_KEY = process.env.OPENROUTER_API_KEY;


if (!API_KEY) {
  console.error(" No se encontró la clave API. Por favor, verifica.");
  process.exit(1);
}

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { mensaje } = req.body;
  console.log(" Mensaje recibido del cliente:", mensaje);

  try {
    const respuesta = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Eres un asistente útil para estudiantes." },
          { role: "user", content: mensaje }
        ]
      })
    });

    const datos = await respuesta.json();
    console.log(" Respuesta de OpenRouter:", datos);

    if (respuesta.ok && datos.choices && datos.choices.length > 0) {
      res.json({ respuesta: datos.choices[0].message.content });
    } else {
      console.error(" Error en la respuesta de OpenRouter:", datos);
      res.status(500).json({ error: "Respuesta inválida de OpenRouter" });
    }
  } catch (error) {
    console.error(" Error al contactar con OpenRouter:", error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

app.listen(PORT, () => {
  console.log(` Servidor backend ejecutándose en http://localhost:${PORT}`);
});