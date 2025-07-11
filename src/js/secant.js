// All the JavaScript from <script> tag in HTML

let functionChart = null;
let convergenceChart = null;
let iterationData = [];

function parseFunction(funcStr) {
    return function(x) {
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

function secantMethod(func, x0, x1, tolerance, maxIter) {
    const startTime = performance.now();
    const iterations = [];
    let iteration = 0;

    let f0 = func(x0);
    let f1 = func(x1);

    while (iteration < maxIter) {
        if (Math.abs(f1 - f0) < 1e-15) {
            throw new Error('Division by zero: f(x₁) - f(x₀) is too small');
        }

        const x2 = x1 - f1 * (x1 - x0) / (f1 - f0);
        const f2 = func(x2);
        const error = Math.abs(x2 - x1);

        iterations.push({
            iteration: iteration + 1,
            x0: x0,
            x1: x1,
            f0: f0,
            f1: f1,
            x2: x2,
            f2: f2,
            error: error
        });

        if (error < tolerance || Math.abs(f2) < tolerance) break;

        x0 = x1;
        f0 = f1;
        x1 = x2;
        f1 = f2;

        iteration++;
    }

    const endTime = performance.now();
    const root = x1;

    let convergenceRate = 'N/A';
    if (iterations.length > 2) {
        const lastErrors = iterations.slice(-3).map(iter => iter.error);
        if (lastErrors[1] > 0 && lastErrors[2] > 0) {
            convergenceRate = Math.log(lastErrors[0] / lastErrors[1]) / Math.log(lastErrors[1] / lastErrors[2]);
            convergenceRate = convergenceRate.toFixed(2);
        }
    }

    return {
        root,
        iterations,
        converged: iterations.length > 0 && iterations[iterations.length - 1].error <= tolerance,
        timeTaken: endTime - startTime,
        finalError: iterations.length > 0 ? iterations[iterations.length - 1].error : 0,
        convergenceRate
    };
}

function findRoots() {
    try {
        const funcStr = document.getElementById('functionInput').value;
        const x0 = parseFloat(document.getElementById('initialGuess1').value);
        const x1 = parseFloat(document.getElementById('initialGuess2').value);
        const tolerance = parseFloat(document.getElementById('tolerance').value);
        const maxIterations = parseInt(document.getElementById('maxIterations').value);

        if (x0 === x1) throw new Error('Initial guesses must be different');

        const func = parseFunction(funcStr);
        const result = secantMethod(func, x0, x1, tolerance, maxIterations);

        document.getElementById('rootValue').textContent = result.root.toFixed(6);
        document.getElementById('iterationCount').textContent = result.iterations.length;
        document.getElementById('timeTaken').textContent = result.timeTaken.toFixed(2);
        document.getElementById('finalError').textContent = result.finalError.toExponential(2);
        document.getElementById('convergenceRate').textContent = result.convergenceRate;
        document.getElementById('statsGrid').style.display = 'grid';

        updateIterationTable(result.iterations);
        updateFunctionChart(func, result.iterations, result.root);
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
        row.insertCell(1).textContent = iter.x0.toFixed(6);
        row.insertCell(2).textContent = iter.x1.toFixed(6);
        row.insertCell(3).textContent = iter.f0.toFixed(6);
        row.insertCell(4).textContent = iter.f1.toFixed(6);
        row.insertCell(5).textContent = iter.x2.toFixed(6);
        row.insertCell(6).textContent = iter.f2.toFixed(6);
        row.insertCell(7).textContent = iter.error.toExponential(2);
    });
}

function updateFunctionChart(func, iterations, root) {
    const ctx = document.getElementById('functionChart').getContext('2d');
    if (functionChart) functionChart.destroy();

    const allX = iterations.flatMap(iter => [iter.x0, iter.x1, iter.x2]);
    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const range = maxX - minX;
    const start = minX - range * 0.5;
    const end = maxX + range * 0.5;
    const step = (end - start) / 200;

    const xData = [], yData = [];
    for (let x = start; x <= end; x += step) {
        xData.push(x);
        yData.push(func(x));
    }

    const datasets = [
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
            data: [{x: root, y: func(root)}],
            borderColor: '#e53e3e',
            backgroundColor: '#e53e3e',
            pointRadius: 8,
            showLine: false
        },
        {
            label: 'Iterations',
            data: iterations.map(iter => ({x: iter.x2, y: iter.f2})),
            borderColor: '#38a169',
            backgroundColor: '#38a169',
            pointRadius: 4,
            showLine: false
        }
    ];

    functionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xData.map(x => x.toFixed(2)),
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
                x: { type: 'linear', position: 'bottom', title: { display: true, text: 'x' } },
                y: { title: { display: true, text: 'f(x)' } }
            }
        }
    });
}

function updateConvergenceChart(iterations) {
    const ctx = document.getElementById('convergenceChart').getContext('2d');
    if (convergenceChart) convergenceChart.destroy();

    const iterationNumbers = iterations.map(iter => iter.iteration);
    const errors = iterations.map(iter => Math.log10(Math.max(iter.error, 1e-16)));
    const rootValues = iterations.map(iter => iter.x2);

    convergenceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: iterationNumbers,
            datasets: [
                {
                    label: 'Log10(Error)',
                    data: errors,
                    borderColor: '#764ba2',
                    backgroundColor: 'rgba(118, 75, 162, 0.1)',
                    tension: 0.1,
                    fill: true,
                    yAxisID: 'y'
                },
                {
                    label: 'Root Estimate',
                    data: rootValues,
                    borderColor: '#38a169',
                    backgroundColor: 'rgba(56, 161, 105, 0.1)',
                    tension: 0.1,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
                x: { title: { display: true, text: 'Iteration' } },
                y: { position: 'left', title: { display: true, text: 'Log10(Error)' } },
                y1: { position: 'right', title: { display: true, text: 'Root Estimate' }, grid: { drawOnChartArea: false } }
            }
        }
    });
}

function clearResults() {
    document.getElementById('statsGrid').style.display = 'none';
    document.getElementById('iterationTableBody').innerHTML = '';
    if (functionChart) { functionChart.destroy(); functionChart = null; }
    if (convergenceChart) { convergenceChart.destroy(); convergenceChart = null; }
    iterationData = [];
}

window.onload = function() {
    findRoots();
};
