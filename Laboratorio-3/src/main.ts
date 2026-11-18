import './styles/styles.css';
import { iniciarBaseDatos } from './db/database';
import { iniciarControlador } from './controllers/recuerdosController';

async function iniciarAplicacion(): Promise<void> {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) return;

  app.innerHTML = `
    <div class="cargando">
      <div>✿</div>
      <h2>Despertando el jardín...</h2>
      <p>Un momento, la magia está comenzando.</p>
    </div>
  `;

  try {
    await iniciarBaseDatos();
    iniciarControlador();
  } catch (error) {
    console.error('Error al iniciar SQLite:', error);

    app.innerHTML = `
      <div class="cargando">
        <h2>El jardín no pudo despertar</h2>
        <p>No se pudo iniciar la base de datos. Recarga la página.</p>
      </div>
    `;
  }
}

iniciarAplicacion();
