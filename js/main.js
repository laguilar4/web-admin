import { apiRequest } from "./utils.js"; 

const url = "http://127.0.0.1/api-php/api";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".login-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            const data = await apiRequest(
            `${url}/login`,
                "POST",
                { email, password }
            );

            if (data.error) {
                alert(data.error || "Error al iniciar sesión");
                return;
            }

            // Guardar datos en localStorage
            localStorage.setItem("usuario", JSON.stringify(data.usuario));

            // Redirigir según rol
            switch (data.usuario.role) {
                case "admin":
                    window.location.href = "views/roles/admin/admin.html";
                    break;
                case "student":
                    window.location.href = "views/roles/student/student.html";
                    break;
                case "teacher":
                    window.location.href = "views/roles/teacher/teacher.html";
                    break;
                default:
                    alert("Rol no reconocido");
            }
        } catch (error) {
            console.error("Error en login:", error);
            alert("No se pudo conectar con el servidor");
        }
    });
});
