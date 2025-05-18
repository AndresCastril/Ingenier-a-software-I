document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const temarioId = urlParams.get('id');
    const apuntesDiv = document.getElementById("apuntes");

    try {
        const response = await fetch(`http://localhost:3366/api/v1/temarios/${temarioId}`);
        const data = await response.json();
        console.log("Datos recibidos:", data);

        if (data.data) {
            apuntesDiv.innerHTML = `
                <h2>${data.data.tema}</h2>
                <p>${data.data.descripcion}</p>
                <!-- Aquí puedes añadir más detalles de los apuntes -->
            `;
        } else {
            apuntesDiv.innerHTML = "<p>No se encontraron apuntes para este temario.</p>";
        }
    } catch (error) {
        console.error("Error al obtener los apuntes:", error);
        apuntesDiv.innerHTML = "<p>Error al cargar los apuntes.</p>";
    }
});
