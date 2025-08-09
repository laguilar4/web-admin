const API_URL = "http://54.147.36.38:8080/api";//"http://127.0.0.1/api-php/api";
const htmlTablaUsuarios = `
  <h2>Gestión de Usuarios</h2>
  <input type="text" id="searchInput" placeholder="Buscar usuario..." style="margin-bottom:10px;padding:5px;width:300px;">
  <table>
    <thead>
      <tr>
        <th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th>
      </tr>
    </thead>
    <tbody id="usuariosBody"></tbody>
  </table>
`;

// HTML formulario crear usuario
const htmlCrearUsuario = `
  <h2>Crear Nuevo Usuario</h2>
  <form id="formCrearUsuario">
    <label for="nombre">Nombre:</label><br />
    <input type="text" id="nombre" name="nombre" required /><br /><br />

    <label for="email">Correo electrónico:</label><br />
    <input type="email" id="email" name="email" required /><br /><br />

    <label for="password">Contraseña:</label><br />
    <input type="password" id="password" name="password" required /><br /><br />

    <label for="role">Rol:</label><br />
    <select id="role" name="role" required>
      <option value="">-- Seleccione un rol --</option>
      <option value="admin">Administrador</option>
      <option value="student">Estudiante</option>
      <option value="teacher">Profesor</option>
    </select><br /><br />

    <button type="submit">Crear Usuario</button>
  </form>
  <div id="mensajeCrearUsuario" style="margin-top: 15px;"></div>
`;
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
// Función para mostrar tabla y cargar usuarios
async function mostrarUsuarios(filtro = "") {
  const main = document.getElementById("mainContent");
  main.innerHTML = htmlTablaUsuarios;

  try {
    const usuarios = await apiRequest(`${API_URL}/users`);
    const tbody = document.getElementById("usuariosBody");

    const usuariosFiltrados = usuarios.filter(u =>
      u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      u.email.toLowerCase().includes(filtro.toLowerCase())
    );

    tbody.innerHTML = usuariosFiltrados.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${u.nombre}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
      </tr>
    `).join("");

    document.getElementById("searchInput").addEventListener("input", (e) => {
      mostrarUsuarios(e.target.value);
    });
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    main.innerHTML = "<p style='color:red;'>Error al cargar los usuarios.</p>";
  }
}

// Función para mostrar formulario crear usuario
function mostrarFormularioCrearUsuario() {
  const main = document.getElementById("mainContent");
  main.innerHTML = htmlCrearUsuario;

  const form = document.getElementById("formCrearUsuario");
  const mensaje = document.getElementById("mensajeCrearUsuario");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nombre: form.nombre.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
      role: form.role.value
    };

    try {
      const res = await apiRequest(`${API_URL}/users`, "POST", data);
      mensaje.style.color = "green";
      mensaje.textContent = res.message || "Usuario creado correctamente";

      // Limpiar formulario
      form.reset();
    } catch (error) {
      mensaje.style.color = "red";
      mensaje.textContent = error.message || "Error al crear usuario";
    }
  });
}

// Asociar eventos a botones
document.getElementById("btnUsuarios").addEventListener("click", (e) => {
  e.preventDefault();
  mostrarUsuarios();
});

document.getElementById("btnCreate").addEventListener("click", (e) => {
  e.preventDefault();
  mostrarFormularioCrearUsuario();
});
