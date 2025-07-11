let functionChart = null;
let convergenceChart = null;
let iterationData = [];

function parseFunction(funcStr) {
    return function (x) {
        try {
            let jsFunc = funcStr
                .replace(/\^/g, '**')
                .replace(/sin/g, 'Math.sin')
                .replace(/cos/g, 'Math.cos')
                .replace(/tan/g, 'Math.tan')
                .replace(/log/g, 'Math.log')
                .replace(/sqrt/g, 'Math.sqrt')
                .replace(/exp/g, 'Math.exp')
                .replace(/pi/g, 'Math.PI')
                .replace(/e/g, 'Math.E');

            jsFunc = jsFunc.replace(/x/g, `(${x})`);
            return eval(jsFunc);
        } catch (error) {
            throw new Error('Invalid function syntax');
        }
    };
}

function bisectionMethod(func, a, b, tolerance, maxIter) {
    const startTime = performance.now();
    const iterations = [];

    if (func(a) * func(b) > 0) {
        throw new Error('Function must have opposite signs at the bounds');
    }

    let iteration = 0;
    let error = Math.abs(b - a);

    while (error > tolerance && iteration < maxIter) {
        const c = (a + b) / 2;
        const fc = func(c);

        iterations.push({
            iteration: iteration + 1,
            a: a,
            b: b,
            c: c,
            fc: fc,
            error: error
        });

        if (Math.abs(fc) < tolerance) {
            break;
        }

        if (func(a) * fc < 0) {
            b = c;
        } else {
            a = c;
        }

        error = Math.abs(b - a);
        iteration++;
    }

    const endTime = performance.now();
    const root = (a + b) / 2;

    return {
        root: root,
        iterations: iterations,
        converged: error <= tolerance,
        timeTaken: endTime - startTime,
        finalError: error
    };
}

function findRoots() {
    try {
        const funcStr = document.getElementById('functionInput').value;
        const lowerBound = parseFloat(document.getElementById('lowerBound').value);
        const upperBound = parseFloat(document.getElementById('upperBound').value);
        const tolerance = parseFloat(document.getElementById('tolerance').value);
        const maxIterations = parseInt(document.getElementById('maxIterations').value);

        const func = parseFunction(funcStr);
        const result = bisectionMethod(func, lowerBound, upperBound, tolerance, maxIterations);

        document.getElementById('rootValue').textContent = result.root.toFixed(6);
        document.getElementById('iterationCount').textContent = result.iterations.length;
        document.getElementById('timeTaken').textContent = result.timeTaken.toFixed(2);
        document.getElementById('finalError').textContent = result.finalError.toExponential(2);

        document.getElementById('statsGrid').style.display = 'grid';

        updateIterationTable(result.iterations);
        updateFunctionChart(func, lowerBound, upperBound, result.root);
        updateConvergenceChart(result.iterations);

        iterationData = result.iterations;
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function updateIterationTable(iterations) {
    const tbody = document.getElementById('iterationTableBody');
    tbody.innerHTML = '';

    iterations.forEach(iter => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = iter.iteration;
        row.insertCell(1).textContent = iter.a.toFixed(6);
        row.insertCell(2).textContent = iter.b.toFixed(6);
        row.insertCell(3).textContent = iter.c.toFixed(6);
        row.insertCell(4).textContent = iter.fc.toFixed(6);
        row.insertCell(5).textContent = iter.error.toExponential(2);
    });
}

function updateFunctionChart(func, a, b, root) {
    const ctx = document.getElementById('functionChart').getContext('2d');

    if (functionChart) functionChart.destroy();

    const range = Math.abs(b - a);
    const start = a - range * 0.5;
    const end = b + range * 0.5;
    const step = (end - start) / 200;

    const xData = [];
    const yData = [];

    for (let x = start; x <= end; x += step) {
        xData.push(x);
        yData.push(func(x));
    }

    functionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xData.map(x => x.toFixed(2)),
            datasets: [
                {
                    label: 'f(x)',
                    data: yData,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.1,
                    pointRadius: 0
                },
                {
                    label: 'Root',
                    data: [{ x: root, y: func(root) }],
                    borderColor: '#e53e3e',
                    backgroundColor: '#e53e3e',
                    pointRadius: 8,
                    showLine: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
                x: { type: 'linear', title: { display: true, text: 'x' } },
                y: { title: { display: true, text: 'f(x)' } }
            }
        }
    });
}

function updateConvergenceChart(iterations) {
    const ctx = document.getElementById('convergenceChart').getContext('2d');

    if (convergenceChart) convergenceChart.destroy();

    const iterationNumbers = iterations.map(iter => iter.iteration);
    const errors = iterations.map(iter => Math.log10(iter.error));

    convergenceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: iterationNumbers,
            datasets: [{
                label: 'Log10(Error)',
                data: errors,
                borderColor: '#764ba2',
                backgroundColor: 'rgba(118, 75, 162, 0.1)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
                x: { title: { display: true, text: 'Iteration' } },
                y: { title: { display: true, text: 'Log10(Error)' } }
            }
        }
    });
}

function clearResults() {
    document.getElementById('statsGrid').style.display = 'none';
    document.getElementById('iterationTableBody').innerHTML = '';

    if (functionChart) functionChart.destroy();
    if (convergenceChart) convergenceChart.destroy();

    functionChart = null;
    convergenceChart = null;
    iterationData = [];
}

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const func = urlParams.get('function');

    if (func) {
        document.getElementById('functionInput').value = func;
    }

    findRoots();  // Run root-finding on page load
};

