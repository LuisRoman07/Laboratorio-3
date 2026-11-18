import initSqlJs, { type Database } from 'sql.js';
import type { Recuerdo } from '../models/recuerdo';

const STORAGE_KEY = 'jardin-recuerdos-sqlite';
let db: Database;

export async function iniciarBaseDatos(): Promise<void> {
  const SQL = await initSqlJs({
    locateFile: (file) => `${import.meta.env.BASE_URL}${file}`
  });

  const guardada = localStorage.getItem(STORAGE_KEY);

  if (guardada) {
    const bytes = Uint8Array.from(
      atob(guardada),
      (char) => char.charCodeAt(0)
    );
    db = new SQL.Database(bytes);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS recuerdos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      fecha TEXT NOT NULL,
      emocion TEXT NOT NULL,
      creado_en TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  guardarCambios();
}

function guardarCambios(): void {
  const bytes = db.export();
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  localStorage.setItem(STORAGE_KEY, btoa(binary));
}

export function obtenerRecuerdos(): Recuerdo[] {
  const resultado = db.exec(
    'SELECT * FROM recuerdos ORDER BY id DESC'
  );

  if (!resultado.length) return [];

  return resultado[0].values.map((fila) => ({
    id: Number(fila[0]),
    titulo: String(fila[1]),
    descripcion: String(fila[2]),
    fecha: String(fila[3]),
    emocion: String(fila[4]) as Recuerdo['emocion']
  }));
}

export function crearRecuerdo(
  titulo: string,
  descripcion: string,
  fecha: string,
  emocion: string
): void {
  db.run(
    `INSERT INTO recuerdos (titulo, descripcion, fecha, emocion)
     VALUES (?, ?, ?, ?)`,
    [titulo, descripcion, fecha, emocion]
  );

  guardarCambios();
}

export function actualizarRecuerdo(
  id: number,
  titulo: string,
  descripcion: string,
  fecha: string,
  emocion: string
): void {
  db.run(
    `UPDATE recuerdos
     SET titulo = ?, descripcion = ?, fecha = ?, emocion = ?
     WHERE id = ?`,
    [titulo, descripcion, fecha, emocion, id]
  );

  guardarCambios();
}

export function eliminarRecuerdo(id: number): void {
  db.run('DELETE FROM recuerdos WHERE id = ?', [id]);
  guardarCambios();
}
