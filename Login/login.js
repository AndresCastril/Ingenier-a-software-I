const pass = document.getElementById("password-login"),
      icon = document.querySelector(".bx");

icon.addEventListener("click", e => {
    if (pass.type === "password"){
        pass.type = "text";
        icon.classList.remove('bx-show-alt');
        icon.classList.add('bx-hide');
    } else {
        pass.type = "password";
        icon.classList.remove('bx-hide');
        icon.classList.add('bx-show-alt');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', onLogin);

    // Verificar si ya hay un token al cargar la página
    const token = localStorage.getItem("token");
    if (token) {
        // Verificar la validez del token
        fetch('http://localhost:3366/api/v1/users/checkToken', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Token válido") {
                // Si el token es válido, redirigir a la página de inicio
                window.location.href = "/Home/home.html";
            }
        })
        .catch(error => {
            // Si el token no es válido o ha expirado, eliminarlo y redirigir al login
            localStorage.removeItem("token");
            console.log("Token expirado o inválido. Redirigiendo al login...");
            window.location.href = "/Login/login.html";
        });
    }
});

const onLogin = async (e) => {
    e.preventDefault();

    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    const body = { email, password };

    await fetch('http://localhost:3366/api/v1/users/login', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Guardar el token en localStorage
            localStorage.setItem("token", data.token);
            console.log("Token guardado:", localStorage.getItem("token"));
            Swal.fire({
                title: "Inicio de sesión exitoso",
                text: "Redirigiendo...",
                icon: "success",
                confirmButtonColor: "#394a5c"
            });

            setTimeout(() => {
                window.location.href = "/Home/home.html";
            }, 2000);
        } else {
            Swal.fire({
                title: "Error",
                text: data.error || "Usuario o contraseña incorrectos",
                icon: "error",
                confirmButtonColor: "#394a5c"
            });
        }
    })
    .catch(error => {
        console.error("Error en la petición:", error);
    });
};
