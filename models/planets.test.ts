import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

import { filterHabitablePlanets } from './planets.ts';

const HABITABLE_PLANET = {
  koi_disposition: 'CONFIRMED',
  koi_prad: '1',
  koi_srad: '1',
  koi_smass: '1',
};

const NOT_CONFIRMED_PLANET = {
  koi_disposition: 'FALSE POSITIVE',
};

const TOO_LARGE_SOLAR_RADIUS = {
  koi_disposition: 'CONFIRMED',
  koi_prad: '1',
  koi_srad: '1.01',
  koi_smass: '1',
};

const TOO_LARGE_SOLAR_MASS = {
  koi_disposition: 'CONFIRMED',
  koi_prad: '1',
  koi_srad: '1',
  koi_smass: '1.04',
};

Deno.test('Filter only habitable planets', () => {
  const filteredPlanets = filterHabitablePlanets([
    HABITABLE_PLANET,
    NOT_CONFIRMED_PLANET,
    TOO_LARGE_SOLAR_RADIUS,
    TOO_LARGE_SOLAR_MASS,
  ]);
  assertEquals(filteredPlanets, [HABITABLE_PLANET]);
});
