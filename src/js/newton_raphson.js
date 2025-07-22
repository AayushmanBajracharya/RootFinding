let functionChart = null;
let convergenceChart = null;
let iterationData = [];

function calculateDerivative(expression) {
    // Split the expression into terms
    const terms = expression.split(/([+-])/);
    let derivative = [];
    let currentOperation = '+';

    for (let i = 0; i < terms.length; i++) {
        let term = terms[i].trim();
        
        if (term === '+' || term === '-') {
            currentOperation = term;
            continue;
        }
        if (!term) continue;

        // Handle exponential functions first
        if (term === 'e^x') {
            derivative.push(currentOperation + 'e^x');
        } else if (term.startsWith('e^(')) {
            // Handle more complex exponential expressions
            const inside = term.slice(3, -1); // Remove 'e^(' and ')'
            if (inside.includes('x')) {
                derivative.push(currentOperation + term); // e^(f(x)) * f'(x)
            }
        } else if (term.includes('ln(x)')) {
            derivative.push(currentOperation + '1/x');
        }
        // Handle trigonometric functions
        else if (term.includes('sin(x)')) {
            derivative.push(currentOperation + 'cos(x)');
        } else if (term.includes('cos(x)')) {
            derivative.push(currentOperation + '(-sin(x))');
        } else if (term.includes('tan(x)')) {
            derivative.push(currentOperation + 'sec^2(x)');
        } else if (term.includes('sec(x)')) {
            derivative.push(currentOperation + 'sec(x)tan(x)');
        } else if (term.includes('csc(x)')) {
            derivative.push(currentOperation + '(-csc(x)cot(x))');
        } else if (term.includes('cot(x)')) {
            derivative.push(currentOperation + '(-csc^2(x))');
        }
        // Handle polynomial expressions
        else if (term.includes('x^')) {
            const [coefficient, power] = term.split('x^');
            const coeff = coefficient ? parseFloat(coefficient) || 1 : 1;
            const pow = parseFloat(power);
            const newCoeff = coeff * pow;
            const newPow = pow - 1;
            
            if (newPow === 0) {
                derivative.push(currentOperation + newCoeff);
            } else if (newPow === 1) {
                derivative.push(currentOperation + newCoeff + 'x');
            } else {
                derivative.push(currentOperation + newCoeff + 'x^' + newPow);
            }
        } else if (term.includes('x')) {
            const coefficient = term.replace('x', '') || '1';
            derivative.push(currentOperation + coefficient);
        } else if (!isNaN(parseFloat(term))) {
            // Constants become 0
            continue;
        }
        currentOperation = '+';
    }

    if (derivative.length === 0) return '0';
    let result = derivative.join('');
    return result[0] === '+' ? result.substring(1) : result;
}

// Update derivative input when function input changes
document.getElementById('functionInput').addEventListener('input', function() {
    const functionExpression = this.value;
    const derivativeExpression = calculateDerivative(functionExpression);
    document.getElementById('derivativeInput').value = derivativeExpression;
});

function parseFunction(funcStr) {
    return function (x) {
        try {
            // First, handle special cases of (-sin(x)) that might come from derivative
            let jsFunc = funcStr.replace(/\(-(sin|cos|tan)\(x\)\)/g, '-Math.$1(x)');
            
            // Handle e^x specially
            jsFunc = jsFunc.replace(/e\^x/g, 'Math.exp(x)');
            jsFunc = jsFunc.replace(/e\^/g, 'Math.exp');
            
            // Handle ln(x)
            jsFunc = jsFunc.replace(/ln\(/g, 'Math.log(');
            
            // Then handle regular replacements
            jsFunc = jsFunc
                .replace(/\^/g, '**')
                .replace(/sin\(/g, 'Math.sin(')
                .replace(/cos\(/g, 'Math.cos(')
                .replace(/tan\(/g, 'Math.tan(')
                .replace(/sec\(/g, '1/Math.cos(')
                .replace(/csc\(/g, '1/Math.sin(')
                .replace(/cot\(/g, '1/Math.tan(')
                .replace(/log\(/g, 'Math.log10(')
                .replace(/sqrt\(/g, 'Math.sqrt(')
                .replace(/exp\(/g, 'Math.exp(')
                .replace(/pi/g, 'Math.PI')
                .replace(/e(?![a-zA-Z])/g, 'Math.E');

            // Replace x with the actual value, but not if it's part of a function name
            jsFunc = jsFunc.replace(/([^a-zA-Z.])x|^x/g, `$1${x}`);
            
            return eval(jsFunc);
        } catch (error) {
            console.error('Parse error:', error, 'for function:', funcStr);
            throw new Error('Invalid function syntax');
        }
    };
}

// Numerical derivative calculation
function numericalDerivative(func, x, h = 1e-8) {
    try {
        const fx_plus_h = func(x + h);
        const fx_minus_h = func(x - h);
        
        if (isNaN(fx_plus_h) || isNaN(fx_minus_h)) {
            throw new Error('Function evaluation failed for derivative');
        }
        
        return (fx_plus_h - fx_minus_h) / (2 * h);
    } catch (error) {
        throw new Error('Derivative calculation failed');
    }
}

// Find good initial guess by looking for zeros or points where function changes sign
function findGoodInitialGuess(func, searchRange = [-10, 10], samples = 100) {
    const candidates = [];
    const step = (searchRange[1] - searchRange[0]) / samples;
    
    let bestGuess = 0;
    let minValue = Infinity;
    
    for (let x = searchRange[0]; x <= searchRange[1]; x += step) {
        try {
            const fx = func(x);
            if (!isNaN(fx) && isFinite(fx)) {
                // Look for point closest to zero
                if (Math.abs(fx) < Math.abs(minValue)) {
                    minValue = fx;
                    bestGuess = x;
                }
                
                // Look for sign changes (potential roots)
                if (candidates.length > 0) {
                    const prevPoint = candidates[candidates.length - 1];
                    if (prevPoint.fx * fx < 0) {
                        // Sign change detected, midpoint is a good guess
                        candidates.push({ x: (prevPoint.x + x) / 2, fx: func((prevPoint.x + x) / 2), priority: 1 });
                    }
                }
                
                candidates.push({ x, fx, priority: 0 });
            }
        } catch (e) {
            continue;
        }
    }
    
    // Sort by priority (sign changes first) then by proximity to zero
    candidates.sort((a, b) => {
        if (a.priority !== b.priority) return b.priority - a.priority;
        return Math.abs(a.fx) - Math.abs(b.fx);
    });
    
    return candidates.length > 0 ? candidates[0].x : bestGuess;
}

// Find multiple potential starting points
function findMultipleStartingPoints(func, searchRange = [-10, 10], numPoints = 5) {
    const points = [];
    const samples = 200;
    const step = (searchRange[1] - searchRange[0]) / samples;
    
    for (let x = searchRange[0]; x <= searchRange[1]; x += step) {
        try {
            const fx = func(x);
            const dfx = numericalDerivative(func, x);
            
            if (!isNaN(fx) && !isNaN(dfx) && isFinite(fx) && isFinite(dfx) && Math.abs(dfx) > 1e-10) {
                points.push({ x, fx, dfx, score: Math.abs(fx) + 0.1 / Math.abs(dfx) });
            }
        } catch (e) {
            continue;
        }
    }
    
    // Sort by score (combination of closeness to zero and derivative magnitude)
    points.sort((a, b) => a.score - b.score);
    
    return points.slice(0, numPoints).map(p => p.x);
}

function newtonRaphsonMethod(func, initialGuess, tolerance, maxIter) {
    const startTime = performance.now();
    const iterations = [];
    
    let x = initialGuess;
    let iteration = 0;
    let error = Infinity;
    
    while (error > tolerance && iteration < maxIter) {
        let fx, dfx;
        
        try {
            fx = func(x);
            // Use either analytical or numerical derivative based on the method selected
            const derivMethod = document.getElementById('derivativeMethod').value;
            if (derivMethod === 'analytical') {
                const derivStr = document.getElementById('derivativeInput').value;
                const derivFunc = parseFunction(derivStr);
                dfx = derivFunc(x);
            } else {
                dfx = numericalDerivative(func, x);
            }
        } catch (error) {
            console.error('Evaluation error:', error);
            throw new Error('Function or derivative evaluation failed: ' + error.message);
        }
        
        if (isNaN(fx) || isNaN(dfx)) {
            throw new Error('Function or derivative returns NaN');
        }
        
        if (Math.abs(dfx) < 1e-15) {
            throw new Error('Derivative is too small (near zero) - method may not converge');
        }
        
        const x_new = x - fx / dfx;
        
        if (isNaN(x_new) || !isFinite(x_new)) {
            throw new Error('New estimate is invalid');
        }
        
        error = Math.abs(x_new - x);
        
        iterations.push({
            iteration: iteration + 1,
            x: x,
            fx: fx,
            dfx: dfx,
            x_new: x_new,
            error: error
        });
        
        // Check for convergence
        if (Math.abs(fx) < tolerance) {
            break;
        }
        
        x = x_new;
        iteration++;
    }
    
    const endTime = performance.now();
    
    return {
        root: x,
        iterations: iterations,
        converged: error <= tolerance || Math.abs(func(x)) <= tolerance,
        timeTaken: endTime - startTime,
        finalError: error
    };
}

function autoSuggestInitialGuess() {
    try {
        const funcStr = document.getElementById('functionInput').value;
        if (!funcStr.trim()) {
            showMessage('Please enter a function first.', 'error');
            return;
        }

        const func = parseFunction(funcStr);
        const guess = findGoodInitialGuess(func);
        
        document.getElementById('initialGuess').value = guess.toFixed(4);
        showMessage(`Suggested initial guess: ${guess.toFixed(4)}`, 'success');
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
        const x0 = parseFloat(document.getElementById('initialGuess').value);
        const tolerance = parseFloat(document.getElementById('tolerance').value);
        const maxIterations = parseInt(document.getElementById('maxIterations').value);
        
        // Parse the function using our parseFunction utility
        const func = parseFunction(funcStr);
        
        // Perform Newton-Raphson iteration with the automatically calculated derivative
        const result = newtonRaphsonMethod(func, x0, tolerance, maxIterations);
        
        // Update UI with results
        displayResults(result, func);
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Display results in the UI
function displayResults(result, func) {
    document.getElementById('rootValue').textContent = result.root.toFixed(6);
    document.getElementById('iterationCount').textContent = result.iterations.length;
    document.getElementById('timeTaken').textContent = result.timeTaken.toFixed(2);
    document.getElementById('finalError').textContent = result.finalError.toExponential(2);

    document.getElementById('statsGrid').style.display = 'grid';

    updateIterationTable(result.iterations);
    updateFunctionChart(func, result.root);
    updateConvergenceChart(result.iterations);

    iterationData = result.iterations;
    
    if (result.converged) {
        showMessage('Root found successfully!', 'success');
    } else {
        showMessage('Maximum iterations reached. Result may not be fully converged.', 'info');
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
        row.insertCell(3).textContent = iter.dfx.toFixed(6);
        row.insertCell(4).textContent = iter.x_new.toFixed(6);
        row.insertCell(5).textContent = iter.error.toExponential(2);
    });
}

function updateFunctionChart(func, root) {
    const ctx = document.getElementById('functionChart').getContext('2d');

    if (functionChart) functionChart.destroy();

    // Create a range around the root
    const range = 5;
    const start = root - range;
    const end = root + range;
    const step = (end - start) / 200;

    const xData = [];
    const yData = [];
    const derivativeData = [];

    // Get the derivative function
    const derivStr = document.getElementById('derivativeInput').value;
    const derivFunc = parseFunction(derivStr);

    for (let x = start; x <= end; x += step) {
        try {
            const y = func(x);
            const dy = derivFunc(x);
            
            if (!isNaN(y) && isFinite(y) && !isNaN(dy) && isFinite(dy)) {
                xData.push(x);
                yData.push(y);
                derivativeData.push(dy);
            }
        } catch (e) {
            // Skip invalid points
        }
    }

    // Create tangent line at root
    const tangentX = [];
    const tangentY = [];
    const rootFx = func(root);
    const rootDfx = numericalDerivative(func, root);
    
    for (let x = root - 2; x <= root + 2; x += 0.1) {
        tangentX.push(x);
        tangentY.push(rootFx + rootDfx * (x - root));
    }

    functionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xData.map(x => x.toFixed(2)),
            datasets: [
                {
                    label: 'f(x)',
                    data: yData,
                    borderColor: '#14b8a6',
                    backgroundColor: 'rgba(20, 184, 166, 0.2)',
                    tension: 0.1,
                    pointRadius: 0,
                    borderWidth: 3,
                    yAxisID: 'y'
                },
                {
                    label: "f'(x)",
                    data: derivativeData,
                    borderColor: '#0891b2',
                    backgroundColor: 'rgba(8, 145, 178, 0.2)',
                    tension: 0.1,
                    pointRadius: 0,
                    borderWidth: 3,
                    yAxisID: 'y'
                },
                {
                    label: 'Root',
                    data: [{ x: root, y: func(root) }],
                    borderColor: '#f59e0b',
                    backgroundColor: '#f59e0b',
                    pointRadius: 10,
                    showLine: false,
                    pointBorderWidth: 2,
                    pointBorderColor: '#ffffff',
                    yAxisID: 'y'
                },
                {
                    label: 'Tangent at Root',
                    data: tangentX.map((x, i) => ({ x, y: tangentY[i] })),
                    borderColor: '#f97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.2)',
                    borderDash: [5, 5],
                    pointRadius: 0,
                    borderWidth: 2,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: { 
                legend: { 
                    display: true,
                    labels: {
                        color: '#e2e8f0',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                x: { 
                    type: 'linear',
                    grid: {
                        color: 'rgba(71, 85, 105, 0.3)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    },
                    title: { 
                        display: true, 
                        text: 'x',
                        color: '#e2e8f0'
                    }
                },
                y: { 
                    type: 'linear',
                    grid: {
                        color: 'rgba(71, 85, 105, 0.3)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    },
                    title: { 
                        display: true, 
                        text: 'f(x), f\'(x)',
                        color: '#e2e8f0'
                    }
                }
            }
        }
    });
}

function updateConvergenceChart(iterations) {
    const ctx = document.getElementById('convergenceChart').getContext('2d');

    if (convergenceChart) convergenceChart.destroy();

    const iterationNumbers = iterations.map(iter => iter.iteration);
    const errors = iterations.map(iter => Math.log10(Math.max(iter.error, 1e-16)));
    const functionValues = iterations.map(iter => Math.log10(Math.max(Math.abs(iter.fx), 1e-16)));

    convergenceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: iterationNumbers,
            datasets: [
                {
                    label: 'Log10(|x_n+1 - x_n|)',
                    data: errors,
                    borderColor: '#14b8a6',
                    backgroundColor: 'rgba(20, 184, 166, 0.2)',
                    tension: 0.1,
                    fill: false,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: '#14b8a6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Log10(|f(x_n)|)',
                    data: functionValues,
                    borderColor: '#22d3ee',
                    backgroundColor: 'rgba(34, 211, 238, 0.2)',
                    tension: 0.1,
                    fill: false,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: '#22d3ee',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: { 
                legend: { 
                    display: true,
                    labels: {
                        color: '#e2e8f0',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                x: { 
                    grid: {
                        color: 'rgba(71, 85, 105, 0.3)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    },
                    title: { 
                        display: true, 
                        text: 'Iteration',
                        color: '#e2e8f0'
                    }
                },
                y: { 
                    grid: {
                        color: 'rgba(71, 85, 105, 0.3)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    },
                    title: { 
                        display: true, 
                        text: 'Log10(Error)',
                        color: '#e2e8f0'
                    }
                }
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

    // Add auto-suggest initial guess button
    const container = document.querySelector('.method-section');
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'text-align: center; margin-top: 10px;';
    
    const autoSuggestBtn = document.createElement('button');
    autoSuggestBtn.className = 'btn';
    autoSuggestBtn.textContent = 'Auto-Suggest Initial Guess';
    autoSuggestBtn.onclick = autoSuggestInitialGuess;
    autoSuggestBtn.style.cssText = 'background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);';
    
    buttonContainer.appendChild(autoSuggestBtn);
    container.appendChild(buttonContainer);

    // Only run findRoots if there's a function provided
    if (func) {
        findRoots();
    }
};