document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token"); 

  if (!token) {
    alert("No estás autenticado. Por favor inicia sesión.");
    window.location.href = "/Login/login.html"; 
    return;
  }

  fetch("http://localhost:3366/api/v1/users", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(async res => {
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          alert("Sesión expirada o no válida. Por favor inicia sesión nuevamente.");
          localStorage.removeItem("token");
          window.location.href = "/Login/login.html";
        }
        throw new Error("Error al obtener datos del usuario");
      }
      return res.json();
    })
    .then(data => {
      const user = data.user || data.data?.[0]; 
      if (!user) throw new Error("No se encontró el usuario");

      document.getElementById("fullname").textContent = user.fullname;
      document.getElementById("email").textContent = user.email;
      document.getElementById("user").textContent = user.user;

 
      document.getElementById("description").textContent = user.description || "Sin descripción disponible";

    
      document.getElementById("profile-image").src = user.image || "/imagenes/perfil.jpg";
    })
    .catch(err => {
      console.error(err);
      alert("Ocurrió un error al cargar el perfil.");
    });


  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/Login/login.html";
  });
});

const editBtn = document.getElementById("edit-btn");
const logoutBtn = document.getElementById("logout-btn");

editBtn.addEventListener("click", () => {
  if (editBtn.textContent === "Editar perfil") {
    enterEditMode();
  } else {
    saveProfileChanges();
  }
});

function enterEditMode() {
  editBtn.textContent = "Guardar cambios";
  logoutBtn.style.display = "none";

  
  const fullname = document.getElementById("fullname");
  const description = document.getElementById("description");
  const email = document.getElementById("email");
  const user = document.getElementById("user");
  const profileImage = document.getElementById("profile-image");

  
  fullname.dataset.original = fullname.textContent;
  description.dataset.original = description.textContent;
  email.dataset.original = email.textContent;
  user.dataset.original = user.textContent;

 
  fullname.innerHTML = `<input type="text" id="input-fullname" value="${fullname.textContent}">`;
  description.innerHTML = `<textarea id="input-description">${description.textContent}</textarea>`;
  email.innerHTML = `<input type="email" id="input-email" value="${email.textContent}" disabled>`;
  user.innerHTML = `<input type="text" id="input-user" value="${user.textContent}" disabled>`;

  
  profileImage.insertAdjacentHTML('afterend', '<input type="file" id="input-image" accept="image/*">');

 
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancelar";
  cancelBtn.classList.add("btn");
  cancelBtn.id = "cancel-btn";
  editBtn.insertAdjacentElement("afterend", cancelBtn);

  cancelBtn.addEventListener("click", cancelEdit);
}

function cancelEdit() {
 
  const fullname = document.getElementById("fullname");
  const description = document.getElementById("description");
  const email = document.getElementById("email");
  const user = document.getElementById("user");
  const profileImage = document.getElementById("profile-image");

  fullname.textContent = fullname.dataset.original;
  description.textContent = description.dataset.original;
  email.textContent = email.dataset.original;
  user.textContent = user.dataset.original;


  const inputImage = document.getElementById("input-image");
  if (inputImage) inputImage.remove();

  document.getElementById("edit-btn").textContent = "Editar perfil";
  document.getElementById("logout-btn").style.display = "inline-block";


  const cancelBtn = document.getElementById("cancel-btn");
  if (cancelBtn) cancelBtn.remove();
}

async function saveProfileChanges() {
  const fullname = document.getElementById("input-fullname").value;
  const description = document.getElementById("input-description").value;
  const inputImage = document.getElementById("input-image");
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("fullname", fullname);
  formData.append("description", description);


  if (inputImage && inputImage.files.length > 0) {
    formData.append("image", inputImage.files[0]);
  }

  try {
    
    const response = await fetch("http://localhost:3366/api/v1/users/profile", {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}` 
      },
      body: formData
    });

    if (!response.ok) throw new Error("Error al actualizar perfil");

    alert("Perfil actualizado con éxito");
    cancelEdit(); 
    cargarDatosUsuario();

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}



async function cargarDatosUsuario() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:3366/api/v1/users", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Error al obtener datos del usuario");
    }

    const data = await response.json();
    const user = data.user || data.data?.[0]; 

    if (!user) {
      throw new Error("No se encontró el usuario");
    }


    document.getElementById("fullname").textContent = user.fullname;
    document.getElementById("email").textContent = user.email;
    document.getElementById("user").textContent = user.user;
    document.getElementById("description").textContent = user.description || "Sin descripción disponible";
    document.getElementById("profile-image").src = user.image || "/imagenes/perfil.jpg";

  } catch (err) {
    console.error(err);
    alert("Ocurrió un error al recargar el perfil.");
  }
}
