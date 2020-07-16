require('dotenv').config(); // NOTE: make sure to always include this at the top of the file (it sets environment synchronously)
const fetch = require('node-fetch');
const queryString = require('querystring');

// TODO: add type checking for all function params

const getToken = async function getToken() {
    try {
        const response = await fetch(process.env.BOOKAWAY_STAGING_AUTH_URL, {
            body: `{"client_id":"${
                process.env.BOOKAWAY_CLIENT_ID
            }","client_secret":"${
                process.env.BOOKAWAY_CLIENT_SECRET
            }","scope":"b2b","grant_type":"client_credentials"}`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
        if (response.ok) {
            const token = await response.json();
            return token.access_token;
        } else {
            throw 'Error getting token';
        }
    } catch (error) {
        throw error;
    }
};

const getAllStations = async function getAllStations(token) {
    try {
        const response = await fetch(
            `${
                process.env.BOOKAWAY_STAGING_SEARCH_AND_BOOK_URL
            }/stations?city=Hanoi`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (response.ok) {
            const stations = await response.json();
            return stations;
        } else {
            throw 'Error getting stations';
        }
    } catch (error) {
        throw error;
    }
};

const getTrips = async function getTrips(
    departureStations,
    arrivalStations,
    departureDate,
    noOfPassengers,
    token
) {
    try {
        const query = queryString.encode({
            departureStation: departureStations,
            arrivalStation: arrivalStations,
            departure: departureDate,
            passengers: noOfPassengers
        });

        const response = await fetch(
            `${
                process.env.BOOKAWAY_STAGING_SEARCH_AND_BOOK_URL
            }/trips?${query}`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (response.ok) {
            const trips = await response.json();
            return trips;
        } else {
            throw 'Error getting trips';
        }
    } catch (error) {
        throw error;
    }
};

const getRemainingCredits = async function getRemainingCredits(token) {
    try {
        const response = await fetch(
            `${process.env.BOOKAWAY_STAGING_SEARCH_AND_BOOK_URL}/credits`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (response.ok) {
            const credits = await response.json();
            return credits;
        } else {
            throw 'Error getting remaining credits';
        }
    } catch (error) {
        throw error;
    }
};

const bookTrip = async function bookTrip(
    tripId,
    passengers,
    firstName,
    lastName,
    contact
) {
    try {
        const body = {
            tripId,
            passengers,
            firstName,
            lastName,
            contact
        };
        const response = await fetch(
            `${process.env.BOOKAWAY_STAGING_SEARCH_AND_BOOK_URL}/bookings`,
            {
                body: JSON.stringify(body),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            }
        );
        if (response.ok) {
            const bookingDetails = await response.json();
            return bookingDetails;
        } else {
            throw 'Error booking trip';
        }
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getToken,
    getAllStations,
    getTrips,
    getRemainingCredits,
    bookTrip
};
