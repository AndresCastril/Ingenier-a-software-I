document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const user = {
                nombre: document.getElementById("nombre").value,
                email: document.getElementById("email").value,
                telefono: document.getElementById("telefono").value,
                edad: document.getElementById("edad").value,
                genero: document.getElementById("genero").value,
                password: document.getElementById("regPassword").value
            };

            // Obtener registros previos
            let users = JSON.parse(localStorage.getItem("usuarios")) || [];
            users.push(user);

            // Guardar en LocalStorage
            localStorage.setItem("usuarios", JSON.stringify(users));

            alert("Registro exitoso");
            registerForm.reset();
        });
    }
});




