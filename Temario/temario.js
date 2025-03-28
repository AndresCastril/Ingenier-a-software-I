document.addEventListener("DOMContentLoaded", async () => {
    const listaTemarios = document.getElementById("temarios");

    try {
        const response = await fetch("http://localhost:3366/api/v1/temarios"); 
        const data = await response.json();
        console.log("Datos recibidos:", data);

        if (data.data && data.data.length > 0) { 
            data.data.forEach(temario => {
                const item = document.createElement("li");
                item.innerHTML = `<strong>Materia:</strong> ${temario.materia} <br>
                                  <strong>Tema:</strong> ${temario.tema} <br>
                                  <strong>Descripción:</strong> ${temario.descripcion} <br>
                                  <strong>Semana:</strong> ${temario.semana}`;
                listaTemarios.appendChild(item);
            });
        } else {
            listaTemarios.innerHTML = "<p>No hay temarios disponibles.</p>";
        }
    } catch (error) {
        console.error("Error al obtener los temarios:", error);
        listaTemarios.innerHTML = "<p>Error al cargar los temarios.</p>";
    }
});
