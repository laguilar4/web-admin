const API_URL = "http://54.147.36.38:8080/api";//"http://127.0.0.1/api-php/api";
const token = localStorage.getItem("token");
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
// Función para mostrar tabla y cargar usuarios
async function mostrarUsuarios(filtro = "") {
  const main = document.getElementById("mainContent");
  main.innerHTML = `
    <div style="margin-bottom: 15px;">
      <input 
        type="text" 
        id="searchInput" 
        placeholder="Buscar usuario..." 
        style="padding: 8px; width: 100%; max-width: 300px; border: 1px solid #ccc; border-radius: 5px;"
        value="${filtro}"
      />
    </div>
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
        <thead style="background-color: #4CAF50; color: white;">
          <tr>
            <th style="padding: 10px; text-align: center;">ID</th>
            <th style="padding: 10px; text-align: center;">Nombre</th>
            <th style="padding: 10px; text-align: center;">Email</th>
            <th style="padding: 10px; text-align: center;">Rol</th>
          </tr>
        </thead>
        <tbody id="usuariosBody"></tbody>
      </table>
    </div>
  `;

  try {
    const usuarios = await apiRequest(`${API_URL}/users`, "GET", null, { Authorization: `Bearer ${token}` });
    const tbody = document.getElementById("usuariosBody");

    const usuariosFiltrados = usuarios.filter(u =>
      u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      u.email.toLowerCase().includes(filtro.toLowerCase())
    );

    tbody.innerHTML = usuariosFiltrados.map(u => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${u.id}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${u.nombre}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${u.email}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${u.role}</td>
      </tr>
    `).join("");

    // Mantener el texto de búsqueda
    document.getElementById("searchInput").addEventListener("input", (e) => {
      mostrarUsuarios(e.target.value);
    });

  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    main.innerHTML = "<p style='color:red;'>Error al cargar los usuarios.</p>";
  }
}


async function addUser(nombre, email, password, role) {
    try {
        const data = await apiRequest(
            `${API_URL}`, 
            "POST", 
            { nombre, email, password, role } ,
            { Authorization: `Bearer ${token}` }
        );

        if (data.message) {
            document.getElementById("mensajeCrearUsuario").innerHTML =
                `<span style="color:green;">${data.message}</span>`;
        } else if (data.error) {
            document.getElementById("mensajeCrearUsuario").innerHTML =
                `<span style="color:red;">${data.error}</span>`;
        }

    } catch (error) {
        console.error("⚠️ Error al crear usuario:", error);
        document.getElementById("mensajeCrearUsuario").innerHTML =
            `<span style="color:red;">Error de conexión con la API</span>`;
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
      const res = await apiRequest(`${API_URL}/users`, "POST", data, { Authorization: `Bearer ${token}` });
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
