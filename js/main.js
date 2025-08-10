const API_URL = "http://54.147.36.38:8080/api";//"http://127.0.0.1/api-php/api";

document.addEventListener("DOMContentLoaded", () => {

    const apiRequest = async (endpoint, method = "GET", body = null, headers = {}) => {
    try {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                 ...headers
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(endpoint, options);
        return await response.json();
    } catch (error) {
        console.error("Error en la petición:", error);
        throw error;
    }
};

    const form = document.querySelector(".login-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            const data = await apiRequest(
            `${API_URL}/login`,
                "POST",
                { email, password }
            );

            if (data.error) {
                alert(data.error || "Error al iniciar sesión");
                return;
            }

            // Guardar datos en localStorage
            localStorage.setItem("usuario", JSON.stringify(data.usuario));

            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            // Redirigir según rol
            switch (data.usuario.role) {
                case "admin":
                    window.location.href = "views/roles/admin/admin.html";
                    break;
                case "student":
                    window.location.href = "views/roles/estudiante/estudiante.html";
                    break;
                case "teacher":
                    window.location.href = "views/roles/profesor/profesor.html";
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
