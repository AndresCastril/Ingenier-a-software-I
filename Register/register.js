const pass = document.getElementById("password-Register"),
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




const url = 'http://localhost:3366/api/v1';

const onSaveInfo = (event) => {
    event.preventDefault();
    const fullName = document.getElementById("name-Register").value;
    const user = document.getElementById("user-Register").value;
    const email = document.getElementById("email-Register").value;
    const password = document.getElementById("password-Register").value;
    
    const body = {
        name: fullName,
        user: user,
        email: email,
        password: password
    };

    console.log('info body', body);

    fetch(`${url}/users/create`, {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(async (response) => {
        const text = await response.text();  
        try {
            return JSON.parse(text); 
        } catch (error) {
            throw new Error(`Respuesta no es JSON: ${text}`);
        }
    })
    .then(data => {
        console.log('data on service', data);

        document.getElementById("name-Register").value = "";
        document.getElementById("user-Register").value = "";
        document.getElementById("email-Register").value = "";
        document.getElementById("password-Register").value = "";

        if (data.error) {
            Swal.fire({
                title: "Error en el registro!",
                text: "¡Hubo un error en el registro!",
                icon: "error",
                confirmButtonColor: "#394a5c"
            });
        } else {
            Swal.fire({
                title: "Registro exitoso",
                text: "¡Tu cuenta ha sido creada correctamente!",
                icon: "success",
                confirmButtonColor: "#394a5c"
            });

        }

        
        
    })
    
    .catch(e => console.error("Error en la petición:", e));
}
