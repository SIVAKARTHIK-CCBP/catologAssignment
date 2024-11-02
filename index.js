const fs = require('fs');

// Function to read, parse, and decode points from a JSON file
function processTestCase(filename) {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));

    // Extract n and k from the input
    const n = data.keys.n;
    const k = data.keys.k;
    let pts = [];

    // Decode the points
    for (let i = 1; i <= n; i++) {
        if (data[i]) {
            const x = i;
            const base = parseInt(data[i].base, 10);
            const yEncode = data[i].value;
            const y = parseInt(yEncode, base);
            pts.push({ x, y });
        }
    }

    // Ensure only the first k points are taken
    pts = pts.slice(0, k);

    // Lagrange interpolation to find f(0)
    function lagrangeInterpolation(pts) {
        let constantTerm = 0;

        for (let i = 0; i < pts.length; i++) {
            let { x: xi, y: yi } = pts[i];
            let term = yi;

            for (let j = 0; j < pts.length; j++) {
                if (i !== j) {
                    let { x: xj } = pts[j];
                    term *= (0 - xj) / (xi - xj);  // Evaluate at x = 0 for the constant term
                }
            }

            constantTerm += term;
        }

        return Math.round(constantTerm);  // Round to the nearest integer if needed
    }

    // Calculate the constant term
    return lagrangeInterpolation(pts);
}

// Process both test cases and print the results
const filenames = ['Testcase1.json', 'Testcase2.json'];

filenames.forEach((filename, index) => {
    const constantTerm = processTestCase(filename);
    console.log(`The secret (constant term c) for Test Case ${index + 1} is: ${constantTerm}`);
});