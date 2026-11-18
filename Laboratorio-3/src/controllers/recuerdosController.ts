import {
  obtenerRecuerdos,
  crearRecuerdo,
  actualizarRecuerdo,
  eliminarRecuerdo
} from '../db/database';

import { renderizarJardin } from '../views/jardin';
import type { Recuerdo } from '../models/recuerdo';

let filtroActual = 'Todas';
let busquedaActual = '';

const app = document.querySelector<HTMLDivElement>('#app')!;

function mostrar(): void {
  const recuerdos = obtenerRecuerdos() as Recuerdo[];

  app.innerHTML = renderizarJardin(
    recuerdos,
    filtroActual,
    busquedaActual
  );

  conectarEventos(recuerdos);
}

function conectarEventos(recuerdos: Recuerdo[]): void {
  const modal = document.querySelector<HTMLDialogElement>('#modal')!;
  const formulario = document.querySelector<HTMLFormElement>('#formulario')!;

  const abrir = () => {
    formulario.reset();
    (document.querySelector<HTMLInputElement>('#id-recuerdo')!).value = '';
    (document.querySelector<HTMLInputElement>('#fecha')!).value =
      new Date().toISOString().slice(0, 10);

    document.querySelector('#titulo-modal')!.textContent =
      'Planta un recuerdo';

    modal.showModal();
  };

  document.querySelector('#nuevo')?.addEventListener('click', abrir);
  document.querySelector('#nuevo-vacio')?.addEventListener('click', abrir);

  document.querySelector('#cerrar')?.addEventListener('click', () => {
    modal.close();
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });

  document.querySelector('#buscar')?.addEventListener('input', (event) => {
    busquedaActual = (event.target as HTMLInputElement).value;
    mostrar();
    const buscar = document.querySelector<HTMLInputElement>('#buscar');
    buscar?.focus();
    buscar?.setSelectionRange(busquedaActual.length, busquedaActual.length);
  });

  document.querySelector('#filtro')?.addEventListener('change', (event) => {
    filtroActual = (event.target as HTMLSelectElement).value;
    mostrar();
  });

  document.querySelectorAll<HTMLButtonElement>('[data-edit]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const recuerdo = recuerdos.find(
        r => r.id === Number(boton.dataset.edit)
      );

      if (!recuerdo) return;

      (document.querySelector<HTMLInputElement>('#id-recuerdo')!).value =
        String(recuerdo.id);

      (document.querySelector<HTMLInputElement>('#titulo')!).value =
        recuerdo.titulo;

      (document.querySelector<HTMLTextAreaElement>('#descripcion')!).value =
        recuerdo.descripcion;

      (document.querySelector<HTMLInputElement>('#fecha')!).value =
        recuerdo.fecha;

      (document.querySelector<HTMLSelectElement>('#emocion')!).value =
        recuerdo.emocion;

      document.querySelector('#titulo-modal')!.textContent =
        'Editar recuerdo';

      modal.showModal();
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-delete]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const confirmar = window.confirm(
        '¿Estás seguro de que quieres eliminar este recuerdo?'
      );

      if (confirmar) {
        eliminarRecuerdo(Number(boton.dataset.delete));
        mostrar();
      }
    });
  });

  formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    const id = Number(
      (document.querySelector<HTMLInputElement>('#id-recuerdo')!).value
    );

    const titulo = (
      document.querySelector<HTMLInputElement>('#titulo')!
    ).value.trim();

    const descripcion = (
      document.querySelector<HTMLTextAreaElement>('#descripcion')!
    ).value.trim();

    const fecha = (
      document.querySelector<HTMLInputElement>('#fecha')!
    ).value;

    const emocion = (
      document.querySelector<HTMLSelectElement>('#emocion')!
    ).value;

    if (!titulo || !descripcion || !fecha) return;

    if (id) {
      actualizarRecuerdo(id, titulo, descripcion, fecha, emocion);
    } else {
      crearRecuerdo(titulo, descripcion, fecha, emocion);
    }

    modal.close();
    mostrar();
  });
}

export function iniciarControlador(): void {
  mostrar();
}
