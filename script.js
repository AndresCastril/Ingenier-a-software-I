document.addEventListener("DOMContentLoaded", () => {
    
    const links = document.querySelectorAll("nav ul li a");
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.style.color = "#f37f12"; 
            link.style.fontWeight = "bold"; // Resalta la página actual
        }
    });

    // Hacer que el menú sea fijo al hacer scroll
    const header = document.querySelector(".header");
    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.style.position = "fixed";
                header.style.top = "0";
                header.style.width = "100%";
                header.style.zIndex = "1000"; 
            } else {
                header.style.position = "relative";
            }
        });
    }

    
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



