const X_BASELINE = 100

const calculateBaseline = (x) => {
    const y = -0.06366 + 0.12613 * Math.cos(Math.PI * x / 500) +
        0.12258 * Math.cos(Math.PI * x / 250) +
        0.01593 * Math.sin(Math.PI * x / 500) +
        0.03147 * Math.sin(Math.PI * x / 250);
    return y;
}

const isAnomalous = (value, baseline) => {
    const threshold = baseline * 0.20;
    return Math.abs(value - baseline) > threshold;
}

const checkAnomalies = (measurements) => {
    let anomalies = 0;
    for (let i = 0; i < measurements.length; i++) {
        const value = measurements[i];
        const baseline = calculateBaseline(X_BASELINE);
        if (isAnomalous(value, baseline)) {
            anomalies++;
        }
    }
    return anomalies >= 5;
}

module.exports = {
    calculateBaseline,
    checkAnomalies,
    isAnomalous
}