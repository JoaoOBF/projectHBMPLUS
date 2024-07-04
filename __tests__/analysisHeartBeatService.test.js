const { calculateBaseline, isAnomalous, checkAnomalies } = require('../services/analysisHeartBeatService');

describe.only('analysisHeartBeatServiceTest', () => {
    it('should calculate baseline', async () => {
        const response = calculateBaseline(100)
        expect(response).toBe(0.11555378430782076);
    });
    it('detects if is anomalous', () => {
        expect(isAnomalous(0.011, 0.185)).toBe(true);
    });
    it('detects if is not anomalous', () => {
        expect(isAnomalous(0.18, 0.185)).toBe(false);
    });
    it('detects anomalies', () => {
        const measurements1 = [
            0.011,
            0.011,
            0.011,
            0.011,
            0.011,
            0.011,
            0.011,
            0.011,
        ];
        expect(checkAnomalies(measurements1)).toBe(true);

        const measurements2 = [
            0.11,
            0.11,
            0.11,
            0.11,
            0.11,
            0.11,
            0.11,
            0.11,
        ];
        expect(checkAnomalies(measurements2)).toBe(false);
    });

});
