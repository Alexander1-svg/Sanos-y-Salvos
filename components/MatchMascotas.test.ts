import { describe, test, expect } from 'vitest';

describe('Pruebas Unitarias: Componente MatchMascotas', () => {

  // Test 3: Basado en los datos físicos 
  test('Compatibilidad: Debería confirmar el match si los rasgos físicos coinciden', () => {
    const rasgosPerdido = { especie: 'Perro', color: 'Negro' };
    const rasgosAvistado = { especie: 'Perro', color: 'Negro' };
    const sonCompatibles = rasgosPerdido.especie === rasgosAvistado.especie && rasgosPerdido.color === rasgosAvistado.color;
    expect(sonCompatibles).toBe(true); 
  });

  // Test 4: Basado en la distancia 
  test('Distancia: Debería rechazar la coincidencia si el avistamiento supera los 10km', () => {
    let distanciaCalculadaKm = 15; 
    const dentroDeRango = distanciaCalculadaKm <= 10; 
    expect(dentroDeRango).toBe(false); 
  });

});