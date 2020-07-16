const chalk = require('chalk');
const {
    getToken,
    getAllStations,
    getTrips,
    getRemainingCredits,
    bookTrip
} = require('./lib.js');

const log = console.log;
const error = chalk.bold.red;
const label = chalk.blue;
const info = chalk.green;

(async function() {
    try {
        // Get authenticated with Bookaway - print the token.
        const token = await getToken();
        log(label('Got token: ') + info(token));

        // Get All the stations from “Hanoi”- print count of stations.
        // Get all the stations from “Sapa” - print count of stations.
        const allStations = await getAllStations(token);
        const hanoiStationIds = allStations.reduce(
            (accumulator, currentStation) => {
                currentStation.city.city === 'Hanoi'
                    ? accumulator.push(currentStation.id)
                    : function() {};
                return accumulator;
            },
            []
        );
        log(label('No of stations at Hanoi: ') + info(hanoiStationIds.length));

        const sapaStationIds = allStations.reduce(
            (accumulator, currentStation) => {
                currentStation.city.city === 'Sapa'
                    ? accumulator.push(currentStation.id)
                    : function() {};
                return accumulator;
            },
            []
        );
        log(label('No of stations at Sapa: ') + info(sapaStationIds.length));

        // Search trips from Hanoi to Sapa on a day of your choice for 2 passengers.
        const trips = await getTrips(
            hanoiStationIds,
            sapaStationIds,
            '2020-07-19',
            2,
            token
        );

        if (trips.length === 0) {
            log(error('No trips found from Hanoi to Sapa'));
            return;
        }

        // Print the renaming credits for your account.
        const remainingCredits = await getRemainingCredits(token);
        log(label('Remaining credits are: ') + info(remainingCredits));

        const tripsWithInstantConfirmation = trips.filter(trip => {
            return trip.isInstantConfirmation;
        });

        const passengersDetails = [
            {
                firstName: 'John',
                lastName: 'Doe',
                extraInfos: [
                    {
                        definition: '5c1b627a50df8883b358e984',
                        value: 'Female'
                    }
                ]
            },
            {
                firstName: 'Johnny',
                lastName: 'Doe',
                extraInfos: [
                    {
                        definition: '5c1b627a50df8883b358e984',
                        value: 'Female'
                    }
                ]
            }
        ];
        const passengersContact = {
            email: 'johndoe@gmail.com',
            phone: '+1 (234) 556-6677'
        };

        if (tripsWithInstantConfirmation.length === 0) {
            const tripsSortedByPrice = trips
                .slice(0)
                .sort((tripOne, tripTwo) => {
                    return tripOne.price.amount - tripTwo.price.amount;
                });
            const cheapestTrip = tripsSortedByPrice[0];
            const bookingDetails = await bookTrip(
                cheapestTrip.id,
                passengersDetails,
                'John',
                'Doe',
                passengersContact
            );
        } else {
            const tripsSortedByPrice = tripsWithInstantConfirmation
                .slice(0)
                .sort((tripOne, tripTwo) => {
                    return tripOne.price.amount - tripTwo.price.amount;
                });
            const cheapestTrip = tripsSortedByPrice[0];

            // Book the cheapest trip that is available and has instant confirmation - print the booking reference. If no trip is instant confirmation, just book the cheapest one.
            const bookingDetails = await bookTrip(
                cheapestTrip.id,
                passengersDetails,
                'John',
                'Doe',
                passengersContact
            );

            // Bonus: print the remaining credits of your account after you booked the trip.
            const remainingCreditsAfterBooking = await getRemainingCredits(
                token
            );
            log(
                label('Remaining credits after booking are: ') +
                    info(remainingCreditsAfterBooking)
            );
        }
    } catch (err) {
        log(error(err));
    }
})();
