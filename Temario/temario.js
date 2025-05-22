document.addEventListener("DOMContentLoaded", async () => {
    const listaTemarios = document.getElementById("temarios");
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login.html"; 
        return;
    }

    try {
        const response = await fetch("http://localhost:3366/api/v1/temarios", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const result = await response.json();
        const temarios = result.data;

        if (temarios.length === 0) {
            listaTemarios.innerHTML = "<p>No hay temarios disponibles.</p>";
            return;
        }

        temarios.forEach(temario => {
            const container = document.createElement("div");
            container.classList.add("temario-container");

            // Aquí creamos un <a> para que toda la tarjeta sea clickeable y tenga estilo compacto
            const link = document.createElement("a");
            link.classList.add("temario-card");
            link.href = `/Apuntes/apuntes.html?id=${temario.id_temario}`;

            link.innerHTML = `
                <div class="temario-info">
                    <span class="temario-titulo">${temario.tema}</span>
                    <strong>Materia:</strong> ${temario.materia}<br>
                    <strong>Descripción:</strong> ${temario.descripcion}<br>
                    <strong>Semana:</strong> ${temario.semana}<br>
                    <button class="btn editar-btn" data-id="${temario.id_temario}">Editar</button>
                    <button class="btn eliminar-btn" data-id="${temario.id_temario}">Eliminar</button>
                </div>
            `;

            container.appendChild(link);
            listaTemarios.appendChild(container);
        });

        // Listener para botones editar y eliminar dentro de las tarjetas
        listaTemarios.addEventListener("click", async (event) => {
            const id = event.target.dataset.id;
            // Botón editar
            if (event.target.classList.contains("editar-btn")) {
                event.preventDefault();
                event.stopPropagation(); // evitar que el link se active
                const temarioElement = event.target.closest(".temario-container");
                editarTemario(id, temarioElement);
                return;
            }
            // Botón eliminar
            if (event.target.classList.contains("eliminar-btn")) {
                event.preventDefault();
                event.stopPropagation();
                eliminarTemario(id);
                return;
            }
            // Click en la tarjeta (no en los botones)
            const card = event.target.closest(".temario-card");
            if (card && !event.target.classList.contains("editar-btn") && !event.target.classList.contains("eliminar-btn")) {
                event.preventDefault();
                const urlParams = new URL(card.href);
                const id_temario = urlParams.searchParams.get("id");
                const token = localStorage.getItem("token");
                try {
                    // Buscar apunte para este temario SOLO usando el id_temario
                    const res = await fetch(`http://localhost:3366/api/v1/apuntes/${id_temario}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data && data.length > 0) {

                            const id_apuntes = data[0].id_apuntes;
                            window.location.href = `/Apuntes/apuntes.html?id=${id_temario}&apunte=${id_apuntes}`;
                        } else {
                            
                            window.location.href = `/Apuntes/apuntes.html?id=${id_temario}`;
                        }
                    } else {
                    
                        window.location.href = `/Apuntes/apuntes.html?id=${id_temario}`;
                    }
                } catch (err) {
                    window.location.href = `/Apuntes/apuntes.html?id=${id_temario}`;
                }
            }
        });

    } catch (error) {
        console.error("Error al obtener los temarios:", error);
        listaTemarios.innerHTML = "<p>Error al cargar los temarios.</p>";
    }
});


function editarTemario(id_temario, temarioElement) {
    const infoDiv = temarioElement.querySelector(".temario-info");

    // Selecciona el tema desde el span.temario-titulo
    const tema = infoDiv.querySelector(".temario-titulo").textContent.trim();
    const strongs = infoDiv.querySelectorAll("strong");
    const materia = strongs[0].nextSibling.textContent.trim();
    const descripcion = strongs[1].nextSibling.textContent.trim();
    const semana = strongs[2].nextSibling.textContent.trim();

    const form = document.createElement("form");
    form.classList.add("edit-form");
    form.innerHTML = `
        <div><label>Materia:</label><input name="materia" value="${materia}" required/></div>
        <div><label>Tema:</label><input name="tema" value="${tema}" required/></div>
        <div><label>Descripción:</label><input name="descripcion" value="${descripcion}" required/></div>
        <div><label>Semana:</label><input name="semana" type="number" value="${semana}" required/></div>
        <button class="guardar-btn">Guardar</button>
        <button class="cancelar-btn">Cancelar</button>
    `;

    temarioElement.appendChild(form);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const updated = {
            materia: form.materia.value,
            tema: form.tema.value,
            descripcion: form.descripcion.value,
            semana: form.semana.value
        };

        try {
            const response = await fetch(`http://localhost:3366/api/v1/temarios/${id_temario}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updated)
            });

            if (!response.ok) throw new Error("Error al actualizar");

            alert("Temario actualizado correctamente.");
            location.reload();
        } catch (error) {
            alert("Error al actualizar: " + error.message);
        }
    });

    form.querySelector(".cancelar-btn").addEventListener("click", (e) => {
        e.preventDefault();
        form.remove();
    });
}


function eliminarTemario(id_temario) {
    if (confirm("¿Eliminar este temario?")) {
        const token = localStorage.getItem("token");

        fetch(`http://localhost:3366/api/v1/temarios/${id_temario}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error("Error al eliminar");
            alert("Temario eliminado correctamente.");
            location.reload();
        })
        .catch(err => {
            console.error("Error:", err);
            alert("Error al eliminar el temario.");
        });
    }
}
