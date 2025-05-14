document.addEventListener('DOMContentLoaded', () => {
        const token = localStorage.getItem("token");
        const logoutBtn = document.getElementById("logout-btn");

        if (token) {
            logoutBtn.style.display = "block";
        } else {
            logoutBtn.style.display = "none";
        }

        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "/Login/login.html";
        });
    });