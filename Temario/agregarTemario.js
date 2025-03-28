document.addEventListener("DOMContentLoaded", () => {
    const btnMostrarFormulario = document.getElementById("btnMostrarFormulario");
    const formTemario = document.getElementById("formTemario");

    btnMostrarFormulario.addEventListener("click", function(event) {
        event.preventDefault();
        formTemario.style.display = "block";
    });

    formTemario.addEventListener("submit", async function(event) {
        event.preventDefault();

        const nuevoTemario = {
            materia: document.getElementById("materia").value,
            tema: document.getElementById("tema").value,
            descripcion: document.getElementById("descripcion").value,
            semana: document.getElementById("semana").value
        };

        try {
            const response = await fetch("http://localhost:3366/api/v1/temarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoTemario)
            });

            const data = await response.json();
            alert("Tema añadido con éxito");

            formTemario.reset();
            formTemario.style.display = "none"; 

        } catch (error) {
            console.error("Error al añadir el tema:", error);
        }
    });
});
document.getElementById("btnMostrarFormulario").addEventListener("click", function(event) {
    event.preventDefault(); // Evita que el enlace recargue la página
    let formulario = document.getElementById("formularioTemario");

    // Alternar la visibilidad del formulario
    if (formulario.style.display === "none" || formulario.style.display === "") {
        formulario.style.display = "block";
    } else {
        formulario.style.display = "none";
    }
});


