const pass = document.getElementById("password-login"),
      icon = document.querySelector(".bx");

icon.addEventListener("click", e => {
    if (pass.type === "password"){
        pass.type = "text";
        icon.classList.remove('bx-show-alt')
        icon.classList.add('bx-hide')
    } else {
        pass.type = "password"
        icon.classList.remove('bx-hide')
        icon.classList.add('bx-show-alt')
    }
})




document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', onLogin);
});

const onLogin = async (e) => {
    e.preventDefault();

    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    const body = { email, password };

    await fetch('http://localhost:3366/api/v1/users', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);

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
                text: "Usuario o contraseña incorrectos",
                icon: "error",
                confirmButtonColor: "#394a5c"
            });
        }
    })
    .catch(error => {
        console.error("Error en la petición:", error);
    });
};
