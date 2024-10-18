const { parse } = require('csv-parse');
const { createReadStream } = require('node:fs');

const habitablePlanets = [];
const isHabitablePlanet = (planet) => {
	return (
		planet['koi_disposition'] === 'CONFIRMED' &&
		planet['koi_insol'] > 0.36 &&
		planet['koi_insol'] < 1.11 &&
		planet['koi_prad'] < 1.6
	);
};

createReadStream('./kepler_data.csv')
	.pipe(
		parse({
			comment: '#',
			columns: true,
		})
	)
	.on('data', (data) => {
		if (isHabitablePlanet(data)) {
			habitablePlanets.push(data);
		}
	})
	.on('error', (err) => {
		console.log(err.message);
	})
	.on('end', () => {
		habitablePlanets.map((planet) => console.log(planet.kepler_name));
		console.log(`Found ${habitablePlanets.length} habitable planets`);
		console.log('Streaming complete');
	});
