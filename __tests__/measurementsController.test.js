const { fetchMeasurements } = require('../controllers/measurementsController');
const db = require('../db/measurementsDB');

jest.mock('../db/measurementsDB', () => ({
    getMeasurements: jest.fn(),
}));

describe('Measurements Controller', () => {
    let ctx;

    beforeEach(() => {
        ctx = {
            status: null,
            body: null,
        };
    });

    test('fetchMeasurements sets status 200 and returns measurements on success', async () => {
        const measurements = [
            { id: 1, heartRate: 72, timestamp: '2023-01-01 00:00:00' },
            { id: 2, heartRate: 75, timestamp: '2023-01-02 00:00:00' },
        ];

        db.getMeasurements.mockResolvedValue(measurements);

        await fetchMeasurements(ctx);

        expect(ctx.status).toBe(200);
        expect(ctx.body).toEqual(measurements);
    });

    test('fetchMeasurements sets status 500 and returns error message on failure', async () => {
        const errorMessage = 'Database error';

        db.getMeasurements.mockRejectedValue(new Error(errorMessage));

        await fetchMeasurements(ctx);

        expect(ctx.status).toBe(500);
        expect(ctx.body).toEqual({ error: errorMessage });
    });
});
