const { fetchIrregularities } = require('../controllers/irregularitiesController');
const db = require('../db/irregularitiesDB');

// Mocking the database module
jest.mock('../db/irregularitiesDB', () => ({
    getAllIrregularities: jest.fn(),
}));

describe('Irregularities Controller', () => {
    let ctx;

    beforeEach(() => {
        ctx = {
            status: null,
            body: null,
        };
    });

    test('fetchIrregularities sets status 200 and returns irregularities on success', async () => {
        const irregularities = [
            { id: 1, start: '2023-01-01 00:00:00', end: '2023-01-01 01:00:00' },
            { id: 2, start: '2023-02-01 00:00:00', end: '2023-02-01 01:00:00' },
        ];

        db.getAllIrregularities.mockResolvedValue(irregularities);

        await fetchIrregularities(ctx);

        expect(ctx.status).toBe(200);
        expect(ctx.body).toEqual(irregularities);
    });

    test('fetchIrregularities sets status 500 and returns error message on failure', async () => {
        const errorMessage = 'Database error';

        db.getAllIrregularities.mockRejectedValue(new Error(errorMessage));

        await fetchIrregularities(ctx);

        expect(ctx.status).toBe(500);
        expect(ctx.body).toEqual({ error: errorMessage });
    });
});
