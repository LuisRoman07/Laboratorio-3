import type { Recuerdo } from '../models/recuerdo';
import { flores, emociones } from '../models/recuerdo';

export function renderizarJardin(
  recuerdos: Recuerdo[],
  filtro: string,
  busqueda: string
): string {
  const filtrados = recuerdos.filter((r) => {
    const coincideEmocion =
      filtro === 'Todas' || r.emocion === filtro;

    const texto = `${r.titulo} ${r.descripcion}`.toLowerCase();
    const coincideBusqueda = texto.includes(busqueda.toLowerCase());

    return coincideEmocion && coincideBusqueda;
  });

  return `
    <main class="contenedor">
      <header class="barra">
        <a class="logo" href="#">
          <span>✧</span> El Jardín de los Recuerdos
        </a>
        <span class="estado">✦ Tu pequeño universo</span>
      </header>

      <section class="hero">
        <div class="estrellas">✧　·　✦　　✧　·　✧</div>
        <p class="sobretitulo">UN LUGAR DONDE EL TIEMPO FLORECE</p>
        <h1>Donde viven tus <em>recuerdos</em></h1>
        <p class="descripcion-hero">
          Cada momento especial merece convertirse en una flor.
          Planta tus recuerdos y deja que tu historia florezca.
        </p>
        <button class="boton-principal" id="nuevo">
          ✿ Plantar un recuerdo
        </button>
        <div class="luna">☾</div>
      </section>

      <section class="estadisticas">
        <div class="stat">
          <span>✿</span>
          <strong>${recuerdos.length}</strong>
          <small>Flores plantadas</small>
        </div>
        <div class="stat">
          <span>♡</span>
          <strong>${new Set(recuerdos.map(r => r.emocion)).size}</strong>
          <small>Emociones vividas</small>
        </div>
        <div class="stat">
          <span>✧</span>
          <strong>∞</strong>
          <small>Momentos especiales</small>
        </div>
      </section>

      <section class="jardin">
        <div class="encabezado-jardin">
          <div>
            <p class="sobretitulo">TU UNIVERSO PERSONAL</p>
            <h2>El jardín encantado <span>✧</span></h2>
          </div>
          <span class="contador">${filtrados.length} recuerdos</span>
        </div>

        <div class="herramientas">
          <input
            type="search"
            id="buscar"
            placeholder="⌕ Buscar un recuerdo..."
            value="${escapar(busqueda)}"
          />
          <select id="filtro">
            <option value="Todas">Todas las emociones</option>
            ${emociones.map(e =>
              `<option value="${e}" ${filtro === e ? 'selected' : ''}>${e}</option>`
            ).join('')}
          </select>
        </div>

        <div class="flores">
          ${filtrados.length ? filtrados.map(r => `
            <article class="tarjeta">
              <div class="flor">${flores[r.emocion]}</div>
              <span class="etiqueta">${escapar(r.emocion)}</span>
              <h3>${escapar(r.titulo)}</h3>
              <p>${escapar(r.descripcion)}</p>
              <small class="fecha">☾ ${escapar(r.fecha)}</small>
              <div class="acciones">
                <button class="editar" data-edit="${r.id}">✎ Editar</button>
                <button class="eliminar" data-delete="${r.id}">✕ Eliminar</button>
              </div>
            </article>
          `).join('') : `
            <div class="vacio">
              <div>🌙</div>
              <h3>Este jardín espera por ti</h3>
              <p>Todavía no hay flores aquí. Planta tu primer recuerdo.</p>
              <button class="boton-principal" id="nuevo-vacio">
                ✿ Crear mi primer recuerdo
              </button>
            </div>
          `}
        </div>
      </section>

      <footer>
        <span>✧ Hecho de recuerdos y un poquito de magia ✧</span>
        <p>EL JARDÍN DE LOS RECUERDOS · 2026</p>
      </footer>

      <dialog id="modal">
        <form id="formulario" class="formulario">
          <button type="button" class="cerrar" id="cerrar">✕</button>
          <p class="sobretitulo">UNA NUEVA HISTORIA</p>
          <h2 id="titulo-modal">Planta un recuerdo</h2>

          <input type="hidden" id="id-recuerdo" />

          <label for="titulo">Nombre de tu recuerdo</label>
          <input id="titulo" maxlength="80" required
            placeholder="Ej. Una noche inolvidable" />

          <label for="descripcion">Cuéntanos tu historia</label>
          <textarea id="descripcion" maxlength="500" required
            placeholder="Escribe ese momento que quieres conservar..."></textarea>

          <label for="fecha">Fecha del recuerdo</label>
          <input id="fecha" type="date" required />

          <label for="emocion">¿Qué emoción representa?</label>
          <select id="emocion" required>
            ${emociones.map(e => `<option value="${e}">${flores[e]} ${e}</option>`).join('')}
          </select>

          <button type="submit" class="boton-principal">
            ✿ Guardar en mi jardín
          </button>
        </form>
      </dialog>
    </main>
  `;
}

function escapar(valor: string): string {
  return valor.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[c] as string);
}
