import * as log from 'https://deno.land/std/log/mod.ts';
import * as _ from 'https://deno.land/x/lodash@4.17.15-es/lodash.js';

interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  customers: Array<string>;
  launchDate: number;
  upcoming: boolean;
  success?: boolean;
  target?: string;
}

const launches = new Map<number, Launch>();

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler('DEBUG'),
  },
  loggers: {
    default: {
      level: 'DEBUG',
      handlers: ['console'],
    },
  },
});

async function downloadLaunchData() {
  log.info('Downloading launch data...');
  const response = await fetch('https://api.spacexdata.com/v3/launches');

  if (!response.ok) {
    log.warning('Problem downloading launch data');
    throw new Error('Launch data download failed.');
  }

  const launchData = await response.json();
  for (const launch of launchData) {
    const payloads = launch['rocket']['second_stage']['payloads'];
    const customers = _.flatMap(
      payloads,
      (payload: any) => payload['customers']
    );
    const flightData = {
      flightNumber: launch['flight_number'],
      mission: launch['mission_name'],
      rocket: launch['rocket']['rocket_name'],
      launchDate: launch['launch_date_unix'],
      upcoming: launch['upcoming'],
      success: launch['launch_success'],
      customers,
    };
    launches.set(flightData.flightNumber, flightData);
  }
}

await downloadLaunchData();
log.info(`Downloaded data for ${launches.size} SpaceX launches.`);

export function getAll() {
  return Array.from(launches.values());
}

export function getOne(id: number) {
  if (launches.has(id)) {
    return launches.get(id);
  }

  return null;
}

export function addOne(data: Launch) {
  launches.set(
    data.flightNumber,
    Object.assign(data, {
      upcoming: true,
      customers: ['Zero to Mastery', 'NASA'],
    })
  );
}

export function removeOne(id: number) {
  const abortedLaunch = launches.get(id);
  if (abortedLaunch) {
    abortedLaunch.upcoming = false;
    abortedLaunch.success = false;
  }
  return abortedLaunch;
}
