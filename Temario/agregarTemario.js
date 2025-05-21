document.addEventListener("DOMContentLoaded", () => {
    const btnMostrarFormulario = document.getElementById("btnMostrarFormulario");
    const formWrapper = document.getElementById("formularioTemario");
    const form = document.getElementById("formTemario");
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    btnMostrarFormulario.addEventListener("click", (e) => {
        e.preventDefault();
        formWrapper.style.display = formWrapper.style.display === "block" ? "none" : "block";
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nuevoTemario = {
            materia: form.materia.value,
            tema: form.tema.value,
            descripcion: form.descripcion.value,
            semana: form.semana.value
        };

        try {
            const response = await fetch("http://localhost:3366/api/v1/temarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(nuevoTemario)
            });

            if (!response.ok) throw new Error("Error al crear temario");

            alert("Temario creado correctamente.");
            form.reset();
            formWrapper.style.display = "none";
            location.reload();
        } catch (error) {
            console.error("Error:", error);
            alert("Error al crear el temario.");
        }
    });
});
