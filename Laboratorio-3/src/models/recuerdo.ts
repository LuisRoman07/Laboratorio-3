export type Emocion =
  | 'Felicidad'
  | 'Amor'
  | 'Nostalgia'
  | 'Gratitud'
  | 'Esperanza'
  | 'Tranquilidad';

export interface Recuerdo {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  emocion: Emocion;
}

export const emociones: Emocion[] = [
  'Felicidad',
  'Amor',
  'Nostalgia',
  'Gratitud',
  'Esperanza',
  'Tranquilidad'
];

export const flores: Record<Emocion, string> = {
  Felicidad: '🌻',
  Amor: '🌹',
  Nostalgia: '🌷',
  Gratitud: '🌼',
  Esperanza: '🪻',
  Tranquilidad: '🪷'
};
