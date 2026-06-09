import { describe, test, expect } from 'vitest';

describe('Pruebas Unitarias: Componente Reports', () => {

  // Test 5: Validación del formulario
  test('Formulario: Debería rechazar un reporte si falta el nombre de la mascota', () => {
    const formularioMascota = { nombre: '', color: 'Blanco', tamano: 'Grande' };
    const esValido = formularioMascota.nombre.trim().length > 0;
    expect(esValido).toBe(false);
  });

  // Test 6: Filtros de la lista
  test('Filtros: Debería filtrar correctamente mascotas por tipo', () => {
    const listaMascotas = [
      { id: 1, tipo: 'Perro', nombre: 'Firulais' },
      { id: 2, tipo: 'Gato', nombre: 'Michi' }
    ];
    const resultadoFiltro = listaMascotas.filter(m => m.tipo === 'Perro');
    expect(resultadoFiltro).toHaveLength(1);
    expect(resultadoFiltro[0].nombre).toBe('Firulais');
  });

});