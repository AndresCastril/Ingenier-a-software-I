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