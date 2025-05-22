// Subida de archivo
document.getElementById("subirArchivoBtn").addEventListener("click", () => {
  document.getElementById("archivoInput").click();
});

document.getElementById("archivoInput").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("apuntes").value = reader.result;
  };
  reader.readAsText(file);
});

// Generación del cuestionario
document.getElementById("generar").addEventListener("click", async () => {
  const apuntes = document.getElementById("apuntes").value.trim();
  if (!apuntes) return alert("Por favor, pega tus apuntes o sube un archivo.");

  const cargando = document.getElementById("cargando");
  cargando.textContent = "⏳ Generando cuestionario...";
  cargando.classList.remove("oculto");
  document.getElementById("cuestionario").innerHTML = "";
  document.getElementById("resultado").innerText = "";
  document.getElementById("evaluar").classList.add("oculto");

  const res = await fetch("http://localhost:3000/api/generar-cuestionario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apuntes })
  });

  const data = await res.json();
  cargando.classList.add("oculto");
  cargando.textContent = "";

  if (!data.preguntas) {
    alert("No se pudo generar el cuestionario.");
    return;
  }

  const cuestionario = document.getElementById("cuestionario");
  data.preguntas.forEach((p, idx) => {
    const div = document.createElement("div");
    div.classList.add("pregunta");
    div.innerHTML = `<strong>${idx + 1}. ${p.pregunta}</strong>`;
    p.opciones.forEach((op) => {
      div.innerHTML += `
        <label class="opcion">
          <input type="radio" name="pregunta${idx}" value="${op}">
          ${op}
        </label>`;
    });
    cuestionario.appendChild(div);
  });

  cuestionario.dataset.respuestas = JSON.stringify(data.preguntas);
  document.getElementById("evaluar").classList.remove("oculto");
});

// Generación de resumen
document.getElementById("resumir").addEventListener("click", async () => {
  const apuntes = document.getElementById("apuntes").value.trim();
  if (!apuntes) return alert("Por favor, pega tus apuntes o sube un archivo.");

  const cargando = document.getElementById("cargando");
  cargando.textContent = "⏳ Generando resumen...";
  cargando.classList.remove("oculto");

  const res = await fetch("http://localhost:3000/api/generar-resumen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apuntes })
  });

  const data = await res.json();
  cargando.classList.add("oculto");

  if (!data.resumen) {
    alert("No se pudo generar el resumen.");
    return;
  }

  document.getElementById("cuestionario").innerHTML =
    `<div class="pregunta"><strong>📘 Resumen generado:</strong><p>${data.resumen}</p></div>`;
  document.getElementById("evaluar").classList.add("oculto");
  document.getElementById("resultado").innerText = "";
});


// Evaluación
document.getElementById("evaluar").addEventListener("click", () => {
  const cuestionario = document.getElementById("cuestionario");
  const preguntas = JSON.parse(cuestionario.dataset.respuestas);
  let correctas = 0;

  const bloques = cuestionario.querySelectorAll(".pregunta");

  preguntas.forEach((p, idx) => {
    const opciones = document.getElementsByName(`pregunta${idx}`);
    const contenedor = bloques[idx];

    let seleccion = null;
    opciones.forEach((opcion) => {
      if (opcion.checked) seleccion = opcion.value;
    });

    const esCorrecta = seleccion === p.respuestaCorrecta;

    if (esCorrecta) {
      correctas++;
      contenedor.innerHTML += `<div class="correcta">✅ Respuesta correcta: <strong>${p.respuestaCorrecta}</strong></div>`;
    } else {
      contenedor.innerHTML += `
        <div class="incorrecta">❌ Respuesta incorrecta</div>
        <div class="correcta">✔️ Respuesta correcta: <strong>${p.respuestaCorrecta}</strong></div>`;
    }
  });

  const total = preguntas.length;
  document.getElementById("resultado").innerText =
    `Obtuviste ${correctas} de ${total} respuestas correctas.`;
});



