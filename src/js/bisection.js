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

function findValidBounds(func, initialA, initialB, maxAttempts = 50) {
    // First try the initial bounds
    try {
        const fa = func(initialA);
        const fb = func(initialB);
        if (!isNaN(fa) && !isNaN(fb) && fa * fb < 0) {
            return { a: initialA, b: initialB, found: true };
        }
    } catch (e) {
        // Function evaluation failed, continue to search
    }

    // Search for valid bounds
    const searchRanges = [
        { start: -10, end: 10, step: 0.5 },
        { start: -5, end: 5, step: 0.2 },
        { start: -2, end: 2, step: 0.1 },
        { start: -1, end: 1, step: 0.05 }
    ];

    for (const range of searchRanges) {
        const points = [];
        
        // Sample points in the range
        for (let x = range.start; x <= range.end; x += range.step) {
            try {
                const fx = func(x);
                if (!isNaN(fx) && isFinite(fx)) {
                    points.push({ x, fx });
                }
            } catch (e) {
                continue;
            }
        }

        // Look for sign changes
        for (let i = 0; i < points.length - 1; i++) {
            if (points[i].fx * points[i + 1].fx < 0) {
                return {
                    a: points[i].x,
                    b: points[i + 1].x,
                    found: true
                };
            }
        }
    }

    return { found: false };
}

function bisectionMethod(func, a, b, tolerance, maxIter) {
    const startTime = performance.now();
    const iterations = [];

    // Check if bounds are valid
    let fa, fb;
    try {
        fa = func(a);
        fb = func(b);
    } catch (error) {
        throw new Error('Function evaluation failed at bounds');
    }

    if (isNaN(fa) || isNaN(fb)) {
        throw new Error('Function returns NaN at bounds');
    }

    if (fa * fb > 0) {
        throw new Error('Function must have opposite signs at the bounds');
    }

    let iteration = 0;
    let error = Math.abs(b - a);

    while (error > tolerance && iteration < maxIter) {
        const c = (a + b) / 2;
        let fc;
        
        try {
            fc = func(c);
        } catch (error) {
            throw new Error('Function evaluation failed during iteration');
        }

        if (isNaN(fc)) {
            throw new Error('Function returns NaN during iteration');
        }

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

function autoSuggestBounds() {
    try {
        const funcStr = document.getElementById('functionInput').value;
        if (!funcStr.trim()) {
            showMessage('Please enter a function first.', 'error');
            return;
        }

        const func = parseFunction(funcStr);
        const currentA = parseFloat(document.getElementById('lowerBound').value) || -2;
        const currentB = parseFloat(document.getElementById('upperBound').value) || 2;
        
        const result = findValidBounds(func, currentA, currentB);
        
        if (result.found) {
            document.getElementById('lowerBound').value = result.a.toFixed(2);
            document.getElementById('upperBound').value = result.b.toFixed(2);
            showMessage(`Suggested bounds: [${result.a.toFixed(2)}, ${result.b.toFixed(2)}]`, 'success');
        } else {
            showMessage('Could not find valid bounds. Try a different function or adjust the search range.', 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = message;
    
    // Style the message
    const styles = {
        info: { background: '#e6fffa', border: '#81e6d9', color: '#234e52' },
        success: { background: '#f0fff4', border: '#9ae6b4', color: '#22543d' },
        error: { background: '#fed7d7', border: '#fc8181', color: '#742a2a' }
    };
    
    const style = styles[type];
    messageDiv.style.cssText = `
        background: ${style.background};
        border: 1px solid ${style.border};
        color: ${style.color};
        padding: 10px;
        border-radius: 5px;
        margin: 10px 0;
        font-weight: 500;
    `;

    // Insert message after the function input
    const functionInput = document.getElementById('functionInput').parentElement;
    functionInput.insertAdjacentElement('afterend', messageDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 5000);
}

function findRoots() {
    try {
        const funcStr = document.getElementById('functionInput').value;
        const lowerBound = parseFloat(document.getElementById('lowerBound').value);
        const upperBound = parseFloat(document.getElementById('upperBound').value);
        const tolerance = parseFloat(document.getElementById('tolerance').value);
        const maxIterations = parseInt(document.getElementById('maxIterations').value);

        // Validate inputs
        if (!funcStr.trim()) {
            throw new Error('Please enter a function');
        }
        if (isNaN(lowerBound) || isNaN(upperBound)) {
            throw new Error('Please enter valid bounds');
        }
        if (lowerBound >= upperBound) {
            throw new Error('Lower bound must be less than upper bound');
        }
        if (tolerance <= 0) {
            throw new Error('Tolerance must be positive');
        }
        if (maxIterations <= 0) {
            throw new Error('Max iterations must be positive');
        }

        const func = parseFunction(funcStr);
        
        // Try to find root with current bounds
        let result;
        try {
            result = bisectionMethod(func, lowerBound, upperBound, tolerance, maxIterations);
        } catch (error) {
            if (error.message.includes('opposite signs')) {
                // Try to find valid bounds automatically
                showMessage('Invalid bounds detected. Searching for valid bounds...', 'info');
                const boundResult = findValidBounds(func, lowerBound, upperBound);
                
                if (boundResult.found) {
                    document.getElementById('lowerBound').value = boundResult.a.toFixed(2);
                    document.getElementById('upperBound').value = boundResult.b.toFixed(2);
                    result = bisectionMethod(func, boundResult.a, boundResult.b, tolerance, maxIterations);
                    showMessage(`Used auto-suggested bounds: [${boundResult.a.toFixed(2)}, ${boundResult.b.toFixed(2)}]`, 'success');
                } else {
                    throw new Error('Could not find valid bounds automatically. Please try different bounds or use the "Auto-Suggest Bounds" button.');
                }
            } else {
                throw error;
            }
        }

        // Display results
        document.getElementById('rootValue').textContent = result.root.toFixed(6);
        document.getElementById('iterationCount').textContent = result.iterations.length;
        document.getElementById('timeTaken').textContent = result.timeTaken.toFixed(2);
        document.getElementById('finalError').textContent = result.finalError.toExponential(2);

        document.getElementById('statsGrid').style.display = 'grid';

        updateIterationTable(result.iterations);
        updateFunctionChart(func, parseFloat(document.getElementById('lowerBound').value), 
                          parseFloat(document.getElementById('upperBound').value), result.root);
        updateConvergenceChart(result.iterations);

        iterationData = result.iterations;
        
        if (result.converged) {
            showMessage('Root found successfully!', 'success');
        } else {
            showMessage('Maximum iterations reached. Result may not be fully converged.', 'info');
        }

    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
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
        try {
            const y = func(x);
            if (!isNaN(y) && isFinite(y)) {
                xData.push(x);
                yData.push(y);
            }
        } catch (e) {
            // Skip invalid points
        }
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
    
    // Clear any messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Initialize on page load
window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const func = urlParams.get('function');

    if (func) {
        document.getElementById('functionInput').value = func;
    }

    // Add auto-suggest bounds button
    const container = document.querySelector('.method-section');
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'text-align: center; margin-top: 10px;';
    
    const autoSuggestBtn = document.createElement('button');
    autoSuggestBtn.className = 'btn';
    autoSuggestBtn.textContent = 'Auto-Suggest Bounds';
    autoSuggestBtn.onclick = autoSuggestBounds;
    autoSuggestBtn.style.cssText = 'background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);';
    
    buttonContainer.appendChild(autoSuggestBtn);
    container.appendChild(buttonContainer);

    // Only run findRoots if there's a function provided
    if (func) {
        findRoots();
    }
};