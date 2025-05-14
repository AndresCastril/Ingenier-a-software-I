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

// home.js
document.addEventListener('DOMContentLoaded', () => { 
  const token = localStorage.getItem("token");
  const loginLinks = document.querySelectorAll(".login-links");
  const profileLinks = document.querySelectorAll(".profile-links");

  if (token) {
    // Verificar el token con el servidor
    verifyToken(token, loginLinks, profileLinks);
  } else {
    // Si no hay token, mostrar solo los botones de inicio de sesión y registro
    loginLinks.forEach(link => link.style.display = "block");
    profileLinks.forEach(link => link.style.display = "none");
    document.getElementById('tools-btn').style.display = 'none';
    document.getElementById('profile-btn').style.display = 'none';
    document.getElementById('login-btn').style.display = 'block';
    document.getElementById('register-btn').style.display = 'block';
  }
});

// Función para verificar el token
async function verifyToken(token, loginLinks, profileLinks) {
  try {
    const response = await fetch('http://localhost:3366/api/v1/users/checkToken', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (data.error) {
      // Si el token es inválido o ha expirado, redirigir al login
      localStorage.removeItem("token");
      window.location.href = "/Login/login.html";
    } else {
      // Token válido, mostrar opciones de perfil
      loginLinks.forEach(link => link.style.display = "none");
      profileLinks.forEach(link => link.style.display = "block");
      document.getElementById('tools-btn').style.display = 'block';
      document.getElementById('profile-btn').style.display = 'block';
      document.getElementById('login-btn').style.display = 'none';
      document.getElementById('register-btn').style.display = 'none';
    }
  } catch (error) {
    console.error("Error verificando el token:", error);
    localStorage.removeItem("token");
    window.location.href = "/Login/login.html";
  }
}

    
