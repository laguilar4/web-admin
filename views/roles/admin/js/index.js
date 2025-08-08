const API_URL = "http://127.0.0.1/api-php/api";
const apiRequest = async (endpoint, method = "GET", body = null, headers = {}) => {
    try {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
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
async function mostrarUsuarios(filtro = "") {
    const main = document.getElementById("mainContent");

    try {
        // Aquí hacemos la petición al backend
        const usuarios = await apiRequest(`${API_URL}/users`);

        const usuariosFiltrados = usuarios.filter(u =>
            u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
            u.email.toLowerCase().includes(filtro.toLowerCase()) ||
            u.role.toLowerCase().includes(filtro.toLowerCase())
        );

        main.innerHTML = `
            <h2>Gestión de Usuarios</h2>
            <input type="text" id="searchInput" placeholder="Buscar usuario..." style="margin-bottom:10px;padding:5px;width:300px;">
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                    </tr>
                </thead>
                <tbody>
                    ${usuariosFiltrados.map(u => `
                        <tr>
                            <td>${u.id}</td>
                            <td>${u.nombre}</td>
                            <td>${u.email}</td>
                            <td>${u.role}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;

        // Evento para búsqueda dinámica
        document.getElementById("searchInput").addEventListener("input", (e) => {
            mostrarUsuarios(e.target.value);
        });

    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        main.innerHTML = "<p style='color:red;'>Error al cargar los usuarios.</p>";
    }
}

// Botón que abre la lista de usuarios
document.getElementById("btnUsuarios").addEventListener("click", (e) => {
    e.preventDefault();
    mostrarUsuarios();
});
