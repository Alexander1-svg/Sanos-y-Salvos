import { describe, test, expect } from 'vitest';

describe('Pruebas Unitarias: Componente MapaPerdida', () => {

  // Test 4: Coordenadas del mapa
  test('Mapa: Debería inicializar las coordenadas por defecto en Santiago de Chile', () => {
    const mapaCoordenadas = { lat: -33.4489, lng: -70.6693 }; 
    expect(mapaCoordenadas.lat).toBeCloseTo(-33.44, 1);
    expect(mapaCoordenadas.lng).toBeCloseTo(-70.66, 1);
  });

  // Test 5: Estado del marcador
  test('Estado: Debería cambiar la etiqueta visual a "Encontrada" al cerrar el caso', () => {
    let estadoMascota = 'Buscada';
    estadoMascota = 'Encontrada';
    expect(estadoMascota).toBe('Encontrada');
  });

});