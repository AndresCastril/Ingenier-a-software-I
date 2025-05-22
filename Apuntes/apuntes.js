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

    let apunteCargado = false;
    try {
        // Consumir el endpoint con el id_temario
        const response = await fetch(`http://localhost:3366/api/v1/apuntes/${temarioId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }

        const responseText = await response.text();
        console.log("Respuesta bruta del backend:", responseText); // <-- LOG
        if (!responseText) {
            editorDiv.innerHTML = "<p>No hay apuntes para este temario. Crea uno nuevo.</p>";
            if (tituloInput) tituloInput.value = "";
            if (resumenInput) resumenInput.value = "";
        } else {
            try {
                const data = JSON.parse(responseText);
               
                let apuntesArray = Array.isArray(data) ? data : (data.data || data.apuntes || [data]);
                if (Array.isArray(apuntesArray) && apuntesArray.length > 0) {
                    const apunte = apuntesArray[0];
                    apunteCargado = true;
                    editorDiv.innerHTML = apunte.description || "<p>Apunte sin contenido.</p>";
                    if (tituloInput) tituloInput.value = apunte.title || "";
                    if (resumenInput) resumenInput.value = apunte.resumen || "";
                    editorDiv.dataset.idApunte = apunte.id_apuntes;
                } else {
                    editorDiv.innerHTML = "<p>No hay apuntes para este temario. Crea uno nuevo.</p>";
                    if (tituloInput) tituloInput.value = "";
                    if (resumenInput) resumenInput.value = "";
                }
            } catch (jsonError) {
                console.error("Error al parsear JSON:", responseText);
                throw new Error("Formato de respuesta inválido del servidor");
            }
        }
    } catch (error) {
        console.error("Error al obtener los apuntes:", error);
        console.error("Detalles del error:", error.message);
        editorDiv.innerHTML = `<p>Error al cargar los apuntes: ${error.message}</p>`;
    }

    // Listener del botón SIEMPRE se agrega
    const guardarBtn = document.querySelector(".guardar-apuntes");
    if (guardarBtn) {
        guardarBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const contenido = editorDiv.innerHTML;
            const idApunte = editorDiv.dataset.idApunte;
            const title = tituloInput ? tituloInput.value.trim() : "Apunte automático";
            const resumen = resumenInput ? resumenInput.value.trim() : contenido.slice(0, 200);

            const url = `http://localhost:3366/api/v1/apuntes`;
            const method = idApunte ? "PUT" : "POST";

            const body = idApunte
                ? { id_apuntes: idApunte, title, resumen, description: contenido, id_temario: temarioId }
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
                    let errorMsg = "Error al guardar apuntes";
                    try {
                        const errorData = await res.json();
                        errorMsg = errorData.message || errorMsg;
                    } catch {}
                    throw new Error(errorMsg);
                }

                alert("Apuntes guardados correctamente");

                if (!idApunte) {
                    try {
                        const data = await res.json();
                        if (data && data.id_apuntes) {
                            editorDiv.dataset.idApunte = data.id_apuntes;
                        }
                    } catch (e) {}
                }
            } catch (err) {
                console.error("Error al guardar apuntes:", err);
                alert("Error al guardar apuntes: " + err.message);
            }
        });
    } else {
        console.error('No se encontró el botón .guardar-apuntes');
    }
});
