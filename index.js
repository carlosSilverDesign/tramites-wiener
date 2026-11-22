/* ==========================================================================
   VISTA: LOGIN / INGRESO (index.js)
   Universidad Norbert Wiener - Sistema de Trámites
   ========================================================================== */

let rol = 'alumno';

function pickRole(r) {
  rol = r;
  document.querySelectorAll('.role-opt').forEach(o => {
    const isMatch = o.dataset.rol === r;
    o.classList.toggle('sel', isMatch);
    const radio = o.querySelector('input[type="radio"]');
    if (radio) radio.checked = isMatch;
  });
  let def = '2021100345';
  if (r === 'administrativo') def = 'ADM-0091';
  else if (r === 'docente') def = 'DOC-712149';
  else if (r === 'director') def = 'DIR-611901';

  const userInput = document.getElementById('user');
  if (userInput) userInput.value = def;
}

function entrar() {
  const userInput = (document.getElementById('user') ? document.getElementById('user').value.trim() : '');
  let u = null;
  if (userInput) {
    u = DB.usuarios().find(x => x.codigo === userInput && x.estado === 'activo');
  }
  if (!u) {
    u = DB.usuarios().find(x => x.rol === rol && x.estado === 'activo');
  }
  if (!u) {
    APP.toast({
      icon: 'warn',
      title: 'Sin cuenta',
      body: 'No hay cuenta activa para este perfil.'
    });
    return;
  }
  APP.setSession({
    id: u.id,
    nombre: u.nombre,
    rol: u.rol,
    email: u.email,
    area: u.area,
    cargo: u.cargo,
    codigo: u.codigo
  });
  location.href = u.rol === 'alumno' ? 'alumno/solicitar.html' : 'admin/inicio.html';
}

// Inicialización de la vista
document.addEventListener('DOMContentLoaded', () => {
  const userInput = document.getElementById('user');
  if (userInput) {
    userInput.value = '2021100345';
  }

  // Soporte para tecla Enter en inputs
  ['user', 'pass'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          entrar();
        }
      });
    }
  });
});

window.pickRole = pickRole;
window.entrar = entrar;
