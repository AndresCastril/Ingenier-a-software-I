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

  document.getElementById("cargando").classList.remove("oculto");
  document.getElementById("cuestionario").innerHTML = "";
  document.getElementById("resultado").innerText = "";
  document.getElementById("evaluar").classList.add("oculto");

  const res = await fetch("http://localhost:3000/api/generar-cuestionario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apuntes })
  });

  const data = await res.json();
  document.getElementById("cargando").classList.add("oculto");

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

// Evaluación
document.getElementById("evaluar").addEventListener("click", () => {
  const cuestionario = document.getElementById("cuestionario");
  const preguntas = JSON.parse(cuestionario.dataset.respuestas);
  let correctas = 0;

  preguntas.forEach((p, idx) => {
    const opciones = document.getElementsByName(`pregunta${idx}`);
    opciones.forEach((opcion) => {
      if (opcion.checked && opcion.value === p.respuestaCorrecta) correctas++;
    });
  });

  const total = preguntas.length;
  document.getElementById("resultado").innerText =
    `✅ Obtuviste ${correctas} de ${total} respuestas correctas.`;
});
