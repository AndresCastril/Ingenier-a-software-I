document.addEventListener("DOMContentLoaded", async () => {
    const listaTemarios = document.getElementById("temarios");

    try {
        const response = await fetch("http://localhost:3366/api/v1/temarios");
        const data = await response.json();
        console.log("Datos recibidos:", data);

        if (data.data && data.data.length > 0) {
            data.data.forEach(temario => {
                const container = document.createElement("div");
                container.classList.add("temario-container");

                const link = document.createElement("a");
                link.classList.add("temario-card");
                link.href = `/Apuntes/apuntes1.html?id=${temario.id_temario}`;

                link.innerHTML = `
                    <div class="temario-info">
                        <strong>Materia:</strong> ${temario.materia}<br>
                        <strong>Tema:</strong> ${temario.tema}<br>
                        <strong>Descripción:</strong> ${temario.descripcion}<br>
                        <strong>Semana:</strong> ${temario.semana} <br>
                        <button class="btn editar-btn" data-id="${temario.id_temario}">Editar</button>
                        <button class="btn eliminar-btn" data-id="${temario.id_temario}">Eliminar</button>
                    </div>
                `;

                container.appendChild(link);
                listaTemarios.appendChild(container);
            });

            // Event Delegation para Editar y Eliminar
            listaTemarios.addEventListener("click", (event) => {
                const id = event.target.dataset.id;

                if (event.target.classList.contains("editar-btn")) {
                    event.preventDefault();
                    event.stopPropagation();
                    const temarioElement = event.target.closest(".temario-container");
                    editarTemario(id, temarioElement);
                }

                if (event.target.classList.contains("eliminar-btn")) {
                    event.preventDefault();
                    event.stopPropagation();
                    eliminarTemario(id);
                }
            });

        } else {
            listaTemarios.innerHTML = "<p>No hay temarios disponibles.</p>";
        }
    } catch (error) {
        console.error("Error al obtener los temarios:", error);
        listaTemarios.innerHTML = "<p>Error al cargar los temarios.</p>";
    }
});

function editarTemario(id_temario, temarioElement) {
    if (temarioElement.querySelector(".edit-form")) return;

    const materia = temarioElement.querySelector("strong:nth-child(1)").nextSibling.textContent.trim();
    const tema = temarioElement.querySelector("strong:nth-child(3)").nextSibling.textContent.trim();
    const descripcion = temarioElement.querySelector("strong:nth-child(5)").nextSibling.textContent.trim();
    const semana = temarioElement.querySelector("strong:nth-child(7)").nextSibling.textContent.trim();

    const form = document.createElement("form");
    form.classList.add("edit-form");
    form.innerHTML = `
        <div class="form-group">
            <label for="materia">Materia:</label>
            <input type="text" id="materia" name="materia" value="${materia}">
        </div>
        <div class="form-group">
            <label for="tema">Tema:</label>
            <input type="text" id="tema" name="tema" value="${tema}">
        </div>
        <div class="form-group">
            <label for="descripcion">Descripción:</label>
            <input type="text" id="descripcion" name="descripcion" value="${descripcion}">
        </div>
        <div class="form-group">
            <label for="semana">Semana:</label>
            <input type="text" id="semana" name="semana" value="${semana}">
        </div>
        <button class="btn guardar-btn">Guardar</button>
        <button class="btn cancelar-btn">Cancelar</button>
    `;

    temarioElement.appendChild(form);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const materia = form.materia.value;
        const tema = form.tema.value;
        const descripcion = form.descripcion.value;
        const semana = form.semana.value;

        console.log("Datos a enviar:", { materia, tema, descripcion, semana });

        fetch(`http://localhost:3366/api/v1/temarios/${id_temario}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ materia, tema, descripcion, semana })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Respuesta del servidor:", data);
            alert("Temario actualizado correctamente.");
            location.reload();
        })
        .catch(error => {
            console.error("Error al actualizar el temario:", error);
            alert("Error al actualizar el temario: " + error.message);
        });
    });

    form.querySelector(".cancelar-btn").addEventListener("click", (e) => {
        e.preventDefault();
        form.remove();
    });
}

function eliminarTemario(id_temario) {
    if (confirm("¿Estás seguro de que deseas eliminar este temario?")) {
        fetch(`http://localhost:3366/api/v1/temarios/${id_temario}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(() => {
            alert("Temario eliminado correctamente.");
            location.reload();
        })
        .catch(error => console.error("Error al eliminar el temario:", error));
    }
}
