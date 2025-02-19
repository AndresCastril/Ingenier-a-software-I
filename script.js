document.addEventListener("DOMContentLoaded", () => {
    // Resaltar la página activa en el menú
    const links = document.querySelectorAll("nav ul li a");
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.style.color = "#f37f12"; // Mismo color del hover
            link.style.fontWeight = "bold"; // Resalta la página actual
        }
    });
});

// Hacer que el menú sea fijo al hacer scroll
window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (window.scrollY > 50) {
        header.style.position = "fixed";
        header.style.top = "0";
        header.style.width = "100%";
        header.style.zIndex = "1000"; // Asegura que esté por encima de otros elementos
    } else {
        header.style.position = "relative";
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const nombre = document.getElementById("nombre").value;
            const email = document.getElementById("email").value;
            const telefono = document.getElementById("telefono").value;
            const edad = document.getElementById("edad").value;
            const genero = document.getElementById("genero").value;
            const password = document.getElementById("regPassword").value;
            console.log("Registro:", { nombre, email, telefono, edad, genero });
            alert("Registro exitoso!");
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const email = document.getElementById("regEmail").value;
            const password = document.getElementById("regPassword").value;

            console.log("Inicio de sesión:", { email, password });
            alert("Inicio de sesión exitoso!");
        });
    }
});




