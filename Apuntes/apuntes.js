document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const temarioId = urlParams.get("id");
    const editorDiv = document.getElementById("editor");
    const tituloInput = document.getElementById("titulo");
    const resumenInput = document.getElementById("resumen");
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    if (!temarioId) {
        editorDiv.innerHTML = "<p>ID de temario no proporcionado.</p>";
        return;
    }

    // Cargar apunte existente si lo hay
    try {
        const response = await fetch(`http://localhost:3366/api/v1/apuntes/${temarioId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Error al obtener apuntes");

        const data = await response.json();

        if (data.length > 0) {
            const apunte = data[0];
            editorDiv.innerHTML = apunte.description || "<p>Apunte sin contenido.</p>";
            if (tituloInput) tituloInput.value = apunte.title || "";
            if (resumenInput) resumenInput.value = apunte.resumen || "";

            editorDiv.dataset.idApunte = apunte.id_apuntes;
        } else {
            editorDiv.innerHTML = "<p>No hay apuntes para este temario.</p>";
            if (tituloInput) tituloInput.value = "";
            if (resumenInput) resumenInput.value = "";
        }
    } catch (error) {
        console.error("Error al obtener los apuntes:", error);
        editorDiv.innerHTML = "<p>Error al cargar los apuntes.</p>";
    }

    // Guardar apuntes
    document.querySelector(".guardar-apuntes").addEventListener("click", async () => {
        const contenido = editorDiv.innerHTML;
        const idApunte = editorDiv.dataset.idApunte;
        const title = tituloInput ? tituloInput.value.trim() : "Apunte automático";
        const resumen = resumenInput ? resumenInput.value.trim() : contenido.slice(0, 200);

        const url = `http://localhost:3366/api/v1/apuntes`;
        const method = idApunte ? "PUT" : "POST";

        const body = idApunte
            ? { id_apuntes: idApunte, title, resumen, description: contenido }
            : { title, resumen, description: contenido, id_temario: temarioId };

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al guardar apuntes");
            }

            alert("Apuntes guardados correctamente");

            if (!idApunte) {
                const data = await res.json();
                editorDiv.dataset.idApunte = data.id;
            }
        } catch (err) {
            console.error("Error al guardar apuntes:", err);
            alert("Error al guardar apuntes: " + err.message);
        }
    });
});
