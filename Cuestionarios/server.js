const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
//require("dotenv").config();

const app = express();
const PORT = 3000;
const API_KEY = "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"; // temporal

if (!API_KEY) {
  console.error("❌ No se encontró la clave API.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// RUTA: Generar Cuestionario
app.post("/api/generar-cuestionario", async (req, res) => {
  const { apuntes } = req.body;

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
          {
            role: "system",
            content: "Eres un generador de cuestionarios. Dado un texto de apuntes, genera preguntas de opción múltiple. Devuelve un JSON con formato: [{ pregunta: '', opciones: ['', '', '', ''], respuestaCorrecta: '' }]"
          },
          {
            role: "user",
            content: `Crea un cuestionario basado en estos apuntes:\n${apuntes}`
          }
        ]
      })
    });

    const datos = await respuesta.json();

    if (datos.choices && datos.choices[0]?.message?.content) {
      const contenido = datos.choices[0].message.content;

      let preguntas;
      try {
        preguntas = JSON.parse(contenido);
      } catch {
        const jsonMatch = contenido.match(/\[.*\]/s);
        if (jsonMatch) preguntas = JSON.parse(jsonMatch[0]);
      }

      if (!Array.isArray(preguntas)) throw new Error("Formato de respuesta inesperado");

      res.json({ preguntas });
    } else {
      res.status(500).json({ error: "Respuesta inválida del modelo." });
    }
  } catch (err) {
    console.error("❌ Error generando cuestionario:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// RUTA: Generar Resumen
app.post("/api/generar-resumen", async (req, res) => {
  const { apuntes } = req.body;

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
          {
            role: "system",
            content: "Eres un asistente académico. Tu tarea es leer apuntes y devolver un resumen claro y conciso del contenido."
          },
          {
            role: "user",
            content: `Resume los siguientes apuntes:\n\n${apuntes}`
          }
        ]
      })
    });

    const datos = await respuesta.json();

    if (datos.choices && datos.choices[0]?.message?.content) {
      res.json({ resumen: datos.choices[0].message.content.trim() });
    } else {
      res.status(500).json({ error: "Respuesta inválida del modelo." });
    }
  } catch (err) {
    console.error("❌ Error generando resumen:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
