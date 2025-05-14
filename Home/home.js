document.addEventListener("DOMContentLoaded", () => {
    Swal.fire({
        title: "¡Bienvenido a BrainBook!",
        icon: "info",
        confirmButtonColor: "#394a5c"
    });
});
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

// token

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem("token");
  const loginLinks = document.querySelectorAll(".login-links");
  const profileLinks = document.querySelectorAll(".profile-links");

  if (token) {
    // Si el token existe, mostrar las opciones de perfil y demás
    loginLinks.forEach(link => link.style.display = "none");
    profileLinks.forEach(link => link.style.display = "block");
  } else {
    // Si no hay token, mostrar solo los botones de inicio de sesión y registro
    loginLinks.forEach(link => link.style.display = "block");
    profileLinks.forEach(link => link.style.display = "none");
  }
});

document.addEventListener('DOMContentLoaded', () => {
        const token = localStorage.getItem('token');

        // Si hay token, mostrar herramientas y perfil, ocultar login y register
        if (token) {
            document.getElementById('tools-btn').style.display = 'block';
            document.getElementById('profile-btn').style.display = 'block';
            document.getElementById('login-btn').style.display = 'none';
            document.getElementById('register-btn').style.display = 'none';
        } else {
            document.getElementById('tools-btn').style.display = 'none';
            document.getElementById('profile-btn').style.display = 'none';
            document.getElementById('login-btn').style.display = 'block';
            document.getElementById('register-btn').style.display = 'block';
        }
    });
