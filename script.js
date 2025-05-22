document.addEventListener("DOMContentLoaded", () => {
    
    const links = document.querySelectorAll("nav ul li a");
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.style.color = "#f37f12"; 
            link.style.fontWeight = "bold"; 
        }
    });

    


    
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

const onChangeText = ()=> {
    const title = document.getElementById('title')
    title.innerText = 'This is the new title'
}

const onGetData = async () => {
    await fetch ('http://localhost:3366/api/v1/products')
    .then((data) => data.json())
    .then(info=>{
        console.log('Array data', info);
    })
}




