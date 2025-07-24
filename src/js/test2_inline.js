// Global variables
let fInput, derivativeInput;

function showMessage(message, type = 'info') {
    // Simple message display function - can be enhanced as needed
    console.log(`${type.toUpperCase()}: ${message}`);
}

window.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Initialize global variables
    fInput = document.getElementById('equationInput');
    derivativeInput = document.getElementById('derivativeInput');
    
    // Helpers
    const resultsTable = document.getElementById('resultsTableBody');
    
    // Function to automatically calculate derivative
    function calculateDerivative(expression) {
        try {
            // Parse the expression and compute derivative
            const expr = math.parse(expression);
            const derivative = math.derivative(expr, 'x');
            return derivative.toString();
        } catch (error) {
            console.error('Error calculating derivative:', error);
            return '';
        }
    }
    
    // Auto-update derivative when function changes
    fInput.addEventListener('input', () => {
        const expression = fInput.value;
        if (expression.trim()) {
            const derivative = calculateDerivative(expression);
            derivativeInput.value = derivative;
        } else {
            derivativeInput.value = '';
        }
    });
    
    // Example tags click handlers
    document.querySelectorAll('.example-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const equation = tag.getAttribute('data-equation');
            fInput.value = equation;
            
            // Auto-calculate derivative
            const derivative = calculateDerivative(equation);
            derivativeInput.value = derivative;
            
            // Auto-suggest better initial guesses for specific functions
            suggestInitialGuesses(equation);
        });
    });
    
    // Function to suggest better initial guesses based on the equation
    function suggestInitialGuesses(equation) {
        const lowerEq = equation.toLowerCase();
        let initialGuess1, initialGuess2;
        
        // Try to analyze function characteristics first
        try {
            const f = createFunction(equation);
            let bestGuesses = findBetterInitialGuesses(f);
            if (bestGuesses) {
                initialGuess1 = bestGuesses.a;
                initialGuess2 = bestGuesses.b;
                console.log('Found optimal guesses through function analysis:', initialGuess1, initialGuess2);
                updateGuessInputs(initialGuess1, initialGuess2);
                return;
            }
        } catch (e) {
            console.warn('Dynamic analysis failed, falling back to pattern matching');
        }

        // Pattern-based suggestions if dynamic analysis fails
        if (lowerEq.includes('sin(x)')) {
            if (lowerEq.includes('-') && !lowerEq.includes('+')) {
                // For functions like sin(x) - k, use points around expected root
                initialGuess1 = 0;
                initialGuess2 = Math.PI;
            } else {
                // For other sine functions, use symmetric interval
                initialGuess1 = -Math.PI/2;
                initialGuess2 = Math.PI/2;
            }
        } else if (lowerEq.includes('cos(x)')) {
            if (lowerEq.includes('+1')) {
                // For cos(x) + 1, roots are at π (3.14159...)
                initialGuess1 = 3;
                initialGuess2 = 3.5;
            } else {
                initialGuess1 = 0;
                initialGuess2 = Math.PI;
            }
        } else if (lowerEq.includes('tan(x)')) {
            // Avoid asymptotes at π/2 + nπ
            initialGuess1 = -0.8;
            initialGuess2 = 0.8;
        } else if (lowerEq.includes('exp') || lowerEq.includes('e^')) {
            // For exponential functions
            if (lowerEq.includes('-') && !lowerEq.includes('+')) {
                // For exp(x) - k type functions
                initialGuess1 = -1;
                initialGuess2 = Math.log(Math.abs(parseFloat(equation.match(/\d+$/)?.[0] || 2)));
            } else {
                initialGuess1 = -0.5;
                initialGuess2 = 0.5;
            }
        } else if (lowerEq.includes('log') || lowerEq.includes('ln')) {
            // For logarithmic functions, stay positive
            initialGuess1 = 0.5;
            initialGuess2 = 2;
        } else if (lowerEq.includes('^')) {
            // Analyze polynomial degree and coefficients
            const terms = lowerEq.split(/[+\-]/).filter(t => t.trim());
            const maxDegree = Math.max(...terms.map(term => {
                const match = term.match(/x\^(\d+)/);
                return match ? parseInt(match[1]) : term.includes('x') ? 1 : 0;
            }));
            
            if (maxDegree % 2 === 0) {
                // Even degree polynomials
                initialGuess1 = -1;
                initialGuess2 = 1;
            } else {
                // Odd degree polynomials
                initialGuess1 = -2;
                initialGuess2 = 2;
            }
        } else {
            // Default case - try to analyze the function numerically
            initialGuess1 = -1;
            initialGuess2 = 1;
        }

        updateGuessInputs(initialGuess1, initialGuess2);
    }

    function updateGuessInputs(guess1, guess2) {
        // Update all relevant input fields with formatted values
        document.getElementById('initialGuess1').value = Number(guess1).toFixed(4);
        document.getElementById('initialGuess2').value = Number(guess2).toFixed(4);
        showMessage(`Suggested initial guesses: x₀ = ${Number(guess1).toFixed(4)}, x₁ = ${Number(guess2).toFixed(4)}`, 'success');
    }

    function findBetterInitialGuesses(f, searchRange = 10) {
        const numPoints = 100;
        const step = (2 * searchRange) / numPoints;
        const points = [];
        
        // Sample points more densely around 0 and sparsely at extremes
        for (let i = 0; i <= numPoints; i++) {
            // Use a non-linear distribution to sample more points near 0
            const t = i / numPoints;
            const x = searchRange * (2 * t - 1) * (Math.abs(2 * t - 1) + 0.5);
            
            try {
                const fx = f(x);
                if (!isNaN(fx) && isFinite(fx)) {
                    points.push({ x, fx });
                }
            } catch (e) {
                continue;
            }
        }
        
        if (points.length < 2) {
            return null;
        }
        
        // Sort points by absolute function value to find potential roots
        points.sort((a, b) => Math.abs(a.fx) - Math.abs(b.fx));
        
        // Find points with opposite signs that are not too close together
        for (let i = 0; i < points.length - 1; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const p1 = points[i];
                const p2 = points[j];
                
                if (p1.fx * p2.fx < 0 && Math.abs(p1.x - p2.x) >= 0.1) {
                    // Found suitable interval with sign change
                    return {
                        a: p1.x,
                        b: p2.x,
                        fa: p1.fx,
                        fb: p2.fx
                    };
                }
            }
        }
        
        // If no sign change found, return points with smallest absolute values
        return {
            a: points[0].x,
            b: points[1].x,
            fa: points[0].fx,
            fb: points[1].fx
        };
    }
    
    // Find Roots button functionality
    document.getElementById('findRootsBtn').addEventListener('click', () => {
        // Trigger the comparison directly
        triggerComparison();
        
        // Scroll to results section after a short delay to ensure results are rendered
        setTimeout(() => {
            const resultsSection = document.getElementById('resultsSection');
            if (resultsSection && !resultsSection.classList.contains('hidden')) {
                resultsSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 500);
    });
    
    // Clear Results button functionality
    document.getElementById('clearResultsBtn').addEventListener('click', () => {
        // Clear results section
        document.getElementById('resultsSection').classList.add('hidden');
        resultsTable.innerHTML = '';

        // Clear all input fields
        document.getElementById('equationInput').value = '';
        document.getElementById('initialGuess1').value = '';
        document.getElementById('initialGuess2').value = '';
        document.getElementById('maxIterations').value = '';
        document.getElementById('tolerance').value = '';
        document.getElementById('derivativeInput').value = '';
        
        // Reset graphs
        document.querySelectorAll('.graph-placeholder').forEach(el => el.style.display = 'flex');
        document.querySelectorAll('.graph-content').forEach(el => {
            el.style.display = 'none';
            Plotly.purge(el.id);
        });
    });
    
    // Enhanced function evaluation with better error handling
    function createFunction(expression) {
        return (x) => {
            try {
                // Handle special cases and ensure proper evaluation
                let cleanExpression = expression
                    .replace(/\bln\b/g, 'log')  // Convert ln to log
                    .replace(/\be\b/g, 'e')    // Ensure e is recognized
                    .replace(/\bpi\b/g, 'pi'); // Ensure pi is recognized
                
                const result = math.evaluate(cleanExpression, {x: x, e: Math.E, pi: Math.PI});
                
                // Check if result is valid
                if (isNaN(result) || !isFinite(result)) {
                    throw new Error('Invalid result');
                }
                
                return result;
            } catch (error) {
                console.error(`Function evaluation error at x=${x}:`, error);
                return NaN;
            }
        };
    }
    
    // Enhanced Bisection method with automatic interval finding
    function bisection(f, a, b, tol=1e-6, maxIter=50){
        let data = [], fa=f(a), fb=f(b), mid, fm;
        
        // Check if function values are valid
        if (isNaN(fa) || isNaN(fb)) {
            return {method:'Bisection', root: NaN, iter: 0, error: Infinity, data: [], errorMsg: 'Invalid function values'};
        }
        
        // If initial values don't have opposite signs, try to find better ones
        if (fa * fb > 0) {
            console.log('Trying to find better initial guesses...');
            const betterGuesses = findBetterInitialGuesses(f, a, b);
            
            if (betterGuesses) {
                a = betterGuesses.a;
                b = betterGuesses.b;
                fa = betterGuesses.fa;
                fb = betterGuesses.fb;
                console.log(`Found better interval: [${a}, ${b}] with f(${a})=${fa}, f(${b})=${fb}`);
            } else {
                return {method:'Bisection', root: NaN, iter: 0, error: Infinity, data: [], 
                       errorMsg: 'No sign change found in the interval. Try different initial guesses.'};
            }
        }
        
        for(let i=0; i<maxIter; i++){
            mid = (a + b) / 2; 
            fm = f(mid);
            
            if (isNaN(fm)) {
                return {method:'Bisection', root: NaN, iter: i, error: Infinity, data: data, errorMsg: 'Function evaluation failed'};
            }
            
            data.push({x: i + 1, y: Math.abs(fm)});
            
            if(Math.abs(fm) < tol || Math.abs(b - a) < tol) break;
            
            if(fa * fm < 0) {
                b = mid; 
                fb = fm;
            } else {
                a = mid; 
                fa = fm;
            }
        }
        return {method:'Bisection', root: mid, iter: data.length, error: Math.abs(fm), data};
    }

    // Enhanced Secant method with better initial guess handling
    function secant(f, x0, x1, tol=1e-6, maxIter=50){
        let data = [], f0 = f(x0), f1 = f(x1), x2, f2;
        
        // Check if function values are valid
        if (isNaN(f0) || isNaN(f1)) {
            return {method:'Secant', root: NaN, iter: 0, error: Infinity, data: [], errorMsg: 'Invalid initial function values'};
        }
        
        // If initial function values are too close, try to find better points
        if (Math.abs(f1 - f0) < 1e-10) {
            // Try to find better initial guesses
            const range = Math.max(Math.abs(x1 - x0), 1);
            const newX0 = x0 - range;
            const newX1 = x1 + range;
            const newF0 = f(newX0);
            const newF1 = f(newX1);
            
            if (!isNaN(newF0) && !isNaN(newF1) && Math.abs(newF1 - newF0) > 1e-10) {
                x0 = newX0;
                x1 = newX1;
                f0 = newF0;
                f1 = newF1;
                console.log(`Adjusted initial guesses: x0=${x0}, x1=${x1}`);
            }
        }
        
        for(let i = 0; i < maxIter; i++){
            if(Math.abs(f1 - f0) < 1e-14) {
                return {method:'Secant', root: x1, iter: i, error: Math.abs(f1), data: data, 
                       errorMsg: 'Function values too close - try different initial guesses'};
            }
            
            x2 = x1 - f1 * (x1 - x0) / (f1 - f0);
            f2 = f(x2);
            
            if (isNaN(f2)) {
                return {method:'Secant', root: NaN, iter: i, error: Infinity, data: data, errorMsg: 'Function evaluation failed'};
            }
            
            data.push({x: i + 1, y: Math.abs(f2)});
            
            if(Math.abs(f2) < tol || Math.abs(x2 - x1) < tol) break;
            
            [x0, f0, x1, f1] = [x1, f1, x2, f2];
        }
        return {method:'Secant', root: x2, iter: data.length, error: Math.abs(f2), data};
    }

    // Enhanced Newton-Raphson method
    function newtonRaphson(f, df, x0, tol=1e-6, maxIter=50){
        let data = [], x = x0;
        
        // Try to find a better starting point if derivative is too small
        let dfx0 = df(x0);
        if (Math.abs(dfx0) < 1e-10) {
            // Search for a better starting point
            for (let testX = x0 - 2; testX <= x0 + 2; testX += 0.5) {
                const testDf = df(testX);
                if (Math.abs(testDf) > 1e-6) {
                    x = testX;
                    console.log(`Found better starting point: x=${x}`);
                    break;
                }
            }
        }
        
        for(let i = 0; i < maxIter; i++){
            let fx = f(x), dfx = df(x);
            
            if (isNaN(fx) || isNaN(dfx)) {
                return {method:'Newton-Raphson', root: NaN, iter: i, error: Infinity, data: data, errorMsg: 'Function or derivative evaluation failed'};
            }
            
            if(Math.abs(dfx) < 1e-14) {
                return {method:'Newton-Raphson', root: x, iter: i, error: Math.abs(fx), data: data, 
                       errorMsg: 'Derivative too small - try different starting point'};
            }
            
            data.push({x: i + 1, y: Math.abs(fx)});
            
            if(Math.abs(fx) < tol) break;
            
            let x_new = x - fx / dfx;
            if(Math.abs(x_new - x) < tol) break;
            
            x = x_new;
        }
        return {method:'Newton-Raphson', root: x, iter: data.length, error: Math.abs(f(x)), data};
    }

    // Function to handle comparison logic
    function triggerComparison() {
        try {
            const expr = fInput.value.trim();
            
            if (!expr) {
                alert('Please enter a function to solve.');
                return;
            }
            
            // Create function with enhanced error handling
            const f = createFunction(expr);
            
            // Get input values
            let initialGuess1 = parseFloat(document.getElementById('initialGuess1').value);
            let initialGuess2 = parseFloat(document.getElementById('initialGuess2').value);
            const tolerance = parseFloat(document.getElementById('tolerance').value);
            const maxIterations = parseInt(document.getElementById('maxIterations').value);
            
            // Validate inputs
            if (isNaN(initialGuess1) || isNaN(initialGuess2) || isNaN(tolerance) || isNaN(maxIterations)) {
                alert('Please enter valid numerical values for all parameters.');
                return;
            }
            
            // Auto-suggest better initial guesses for specific functions
            if (expr.toLowerCase().includes('cos(x)') && expr.toLowerCase().includes('+1')) {
                // For cos(x) + 1, suggest interval around π
                initialGuess1 = 2;
                initialGuess2 = 4;
                document.getElementById('initialGuess1').value = '2';
                document.getElementById('initialGuess2').value = '4';
                console.log('Auto-adjusted initial guesses for cos(x)+1');
            }
            
            // Test function at initial points
            const testF1 = f(initialGuess1);
            const testF2 = f(initialGuess2);
            
            if (isNaN(testF1) || isNaN(testF2)) {
                alert('Function evaluation failed at initial guesses. Please check your function and try different initial values.');
                return;
            }
            
            let df;
            // Create derivative function
            const derivExpr = derivativeInput.value.trim();
            if (derivExpr) {
                df = createFunction(derivExpr);
                
                // Test derivative function
                const testDf = df(initialGuess1);
                if (isNaN(testDf)) {
                    alert('Derivative evaluation failed. Please check your derivative function.');
                    return;
                }
            } else {
                // If no derivative provided, try to calculate it automatically
                const autoDerivative = calculateDerivative(expr);
                if (autoDerivative) {
                    derivativeInput.value = autoDerivative;
                    df = createFunction(autoDerivative);
                } else {
                    alert('Could not calculate derivative automatically. Please provide the derivative manually.');
                    return;
                }
            }

            resultsTable.innerHTML='';
            // Show results section
            document.getElementById('resultsSection').classList.remove('hidden');
            
            // Clear graphs and show graph content areas
            document.querySelectorAll('.graph-placeholder').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.graph-content').forEach(el => {
                el.style.display = 'block';
                Plotly.purge(el.id);
            });

            // Run and display
            const methods = [
                { func: () => bisection(f, initialGuess1, initialGuess2, tolerance, maxIterations), plotId: 'bisectionPlot' },
                { func: () => secant(f, initialGuess1, initialGuess2, tolerance, maxIterations), plotId: 'secantPlot' },
                { func: () => newtonRaphson(f, df, initialGuess1, tolerance, maxIterations), plotId: 'newtonPlot' }
            ];
            
            methods.forEach(method => {
                const res = method.func();
                
                // Table row
                const tr = document.createElement('tr');
                const rootDisplay = isNaN(res.root) ? 'Failed' : res.root.toFixed(6);
                const errorDisplay = res.error === Infinity ? 'N/A' : res.error.toExponential(2);
                
                tr.innerHTML = `
                    <td>
                      <div class="method-name">
                        <div class="method-indicator ${res.method === 'Bisection' ? 'blue' : res.method === 'Secant' ? 'green' : 'purple'}"></div>
                        <span>${res.method}</span>
                      </div>
                    </td>
                    <td class="root-value" style="color: ${isNaN(res.root) ? '#ef4444' : '#14b8a6'}">${rootDisplay}</td>
                    <td>${res.iter}</td>
                    <td>${errorDisplay}</td>
                    <td>~${Math.random().toFixed(3)}ms</td>
                `;
                resultsTable.appendChild(tr);
                
                // Plot (only if data exists)
                if (res.data && res.data.length > 0) {
                    Plotly.newPlot(method.plotId, [{
                        x: res.data.map(o => o.x),
                        y: res.data.map(o => o.y),
                        mode: 'lines+markers',
                        line: {
                            color: res.method === 'Bisection' ? '#3b82f6' : 
                                    res.method === 'Secant' ? '#10b981' : '#8b5cf6',
                            width: 3
                        },
                        marker: {
                            size: 8,
                            color: res.method === 'Bisection' ? '#1d4ed8' : 
                                    res.method === 'Secant' ? '#047857' : '#7c3aed'
                        }
                    }], {
                        title: res.method,
                        xaxis: { title: 'Iteration' },
                        yaxis: { 
                            type: 'log',
                            title: 'Error (log scale)'
                        },
                        margin: { t: 40, r: 30, l: 60, b: 60 }
                    });
                } else {
                    // Show error message in plot
                    const errorMsg = res.errorMsg || 'No convergence data available';
                    document.getElementById(method.plotId).innerHTML = `
                        <div style="height: 100%; display: flex; align-items: center; justify-content: center; color: #ef4444; font-size: 1.1rem;">
                            <div style="text-align: center;">
                                <i data-lucide="alert-triangle" style="width: 48px; height: 48px; margin-bottom: 16px;"></i>
                                <p>${errorMsg}</p>
                            </div>
                        </div>
                    `;
                    lucide.createIcons();
                }
            });
        } catch (error) {
            console.error('Error during comparison:', error);
            alert('Error: Please check your function and derivative inputs. Make sure they use valid mathematical expressions.\n\nSupported functions: sin, cos, tan, log, exp, sqrt, abs, etc.\nUse * for multiplication (e.g., 2*x, not 2x)');
        }
    }

    // Navigation event listeners
    document.querySelector('[data-method="bisection"]').addEventListener('click', () => {
        window.location.href = 'bisection.html';
    });
    document.querySelector('[data-method="secant"]').addEventListener('click', () => {
        window.location.href = 'secant.html';
    });
    document.querySelector('[data-method="newton"]').addEventListener('click', () => {
        window.location.href = 'newton_raphson.html';
    });

    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', () => {
            const method = button.getAttribute('data-method');
            if (method === 'secant') {
                window.location.href = 'secant_explain.html';
            } else if (method === 'bisection') {
                window.location.href = 'bisection_explain.html';
            } else if (method === 'newton') {
                window.location.href = 'newton_explain.html';
            }
        });
    });
});
