// script.js

let functionChart = null;
let convergenceChart = null;
let iterationData = [];

document.getElementById('derivativeMethod').addEventListener('change', function() {
    const derivativeGroup = document.getElementById('derivativeInputGroup');
    if (this.value === 'analytical') {
        derivativeGroup.style.display = 'flex';
    } else {
        derivativeGroup.style.display = 'none';
    }
});

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

function numericalDerivative(func, x, h = 1e-8) {
    return (func(x + h) - func(x - h)) / (2 * h);
}

function newtonRaphsonMethod(func, derivative, x0, tolerance, maxIter, useNumerical = false) {
    const startTime = performance.now();
    const iterations = [];

    let x = x0;
    let iteration = 0;
    let error = Infinity;

    while (Math.abs(error) > tolerance && iteration < maxIter) {
        const fx = func(x);
        const fpx = useNumerical ? numericalDerivative(func, x) : derivative(x);

        if (Math.abs(fpx) < 1e-15) {
            throw new Error('Derivative is zero. Cannot continue.');
        }

        const x_new = x - fx / fpx;
        error = x_new - x;

        iterations.push({
            iteration: iteration + 1,
            x: x,
            fx: fx,
            fpx: fpx,
            x_new: x_new,
            error: Math.abs(error)
        });

        x = x_new;
        iteration++;

        if (Math.abs(fx) < tolerance) {
            break;
        }
    }

    const endTime = performance.now();

    return {
        root: x,
        iterations: iterations,
        converged: Math.abs(error) <= tolerance || Math.abs(func(x)) <= tolerance,
        timeTaken: endTime - startTime,
        finalError: Math.abs(error)
    };
}

function findRoots() {
    try {
        const funcStr = document.getElementById('functionInput').value;
        const derivativeStr = document.getElementById('derivativeInput').value;
        const initialGuess = parseFloat(document.getElementById('initialGuess').value);
        const tolerance = parseFloat(document.getElementById('tolerance').value);
        const maxIterations = parseInt(document.getElementById('maxIterations').value);
        const useNumerical = document.getElementById('derivativeMethod').value === 'numerical';

        const func = parseFunction(funcStr);
        const derivative = useNumerical ? null : parseFunction(derivativeStr);

        const result = newtonRaphsonMethod(func, derivative, initialGuess, tolerance, maxIterations, useNumerical);

        document.getElementById('rootValue').textContent = result.root.toFixed(6);
        document.getElementById('iterationCount').textContent = result.iterations.length;
        document.getElementById('timeTaken').textContent = result.timeTaken.toFixed(2);
        document.getElementById('finalError').textContent = result.finalError.toExponential(2);

        document.getElementById('statsGrid').style.display = 'grid';

        updateIterationTable(result.iterations);
        updateFunctionChart(func, derivative, result.root, result.iterations, useNumerical);
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
        row.insertCell(1).textContent = iter.x.toFixed(6);
        row.insertCell(2).textContent = iter.fx.toFixed(6);
        row.insertCell(3).textContent = iter.fpx.toFixed(6);
        row.insertCell(4).textContent = iter.x_new.toFixed(6);
        row.insertCell(5).textContent = iter.error.toExponential(2);
    });
}

function updateFunctionChart(func, derivative, root, iterations, useNumerical) {
    const ctx = document.getElementById('functionChart').getContext('2d');

    if (functionChart) functionChart.destroy();

    const xValues = iterations.map(iter => iter.x);
    xValues.push(root);
    const xMin = Math.min(...xValues) - 1;
    const xMax = Math.max(...xValues) + 1;
    const step = (xMax - xMin) / 200;

    const xData = [];
    const yData = [];
    const derivativeData = [];

    for (let x = xMin; x <= xMax; x += step) {
        xData.push(x);
        yData.push(func(x));
        if (derivative && !useNumerical) {
            derivativeData.push(derivative(x));
        }
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
            label: 'f\'(x)',
            data: derivativeData,
            borderColor: '#38b2ac',
            backgroundColor: 'rgba(56, 178, 172, 0.1)',
            tension: 0.1,
            pointRadius: 0,
            hidden: useNumerical
        },
        {
            label: 'Root',
            data: [{ x: root, y: func(root) }],
            borderColor: '#e53e3e',
            backgroundColor: '#e53e3e',
            pointRadius: 8,
            showLine: false
        },
        {
            label: 'Iterations',
            data: iterations.map(iter => ({ x: iter.x, y: func(iter.x) })),
            borderColor: '#f6ad55',
            backgroundColor: '#f6ad55',
            pointRadius: 4,
            showLine: false
        }
    ];

    functionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xData.map(x => x.toFixed(2)),
            datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                x: {
                    type: 'linear',
                    title: { display: true, text: 'x' }
                },
                y: {
                    title: { display: true, text: 'y' }
                }
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
            plugins: {
                legend: { display: true }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Iteration' }
                },
                y: {
                    title: { display: true, text: 'Log10(Error)' }
                }
            }
        }
    });
}

function clearResults() {
    document.getElementById('statsGrid').style.display = 'none';
    document.getElementById('iterationTableBody').innerHTML = '';

    if (functionChart) {
        functionChart.destroy();
        functionChart = null;
    }

    if (convergenceChart) {
        convergenceChart.destroy();
        convergenceChart = null;
    }

    iterationData = [];
}

window.onload = function() {
    findRoots();
};
