// All the JavaScript from <<script>> tag in HTML

        let functionChart = null;
        let convergenceChart = null;
        let iterationData = [];

        function findValidGuesses(func, searchRanges = [
            { start: -10, end: 10, step: 0.5 },
            { start: -5, end: 5, step: 0.2 },
            { start: -2, end: 2, step: 0.1 }
        ]) {
            const points = [];
            
            // Sample points and their function values
            for (const range of searchRanges) {
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
            }
            
            if (points.length < 2) {
                throw new Error('Could not find suitable initial points');
            }

            // Sort points by their function values
            points.sort((a, b) => Math.abs(a.fx) - Math.abs(b.fx));
            
            // Return the points with values closest to zero, but with some distance between them
            let x0 = points[0].x;
            let x1;
            
            // Find a second point that's at least 0.5 units away from x0
            for (let i = 1; i < points.length; i++) {
                if (Math.abs(points[i].x - x0) >= 0.5) {
                    x1 = points[i].x;
                    break;
                }
            }
            
            // If no point found with minimum distance, just take the second best point
            if (x1 === undefined) {
                x1 = points[1].x;
            }

            return { x0, x1 };
        }

        function autoSuggestGuesses() {
            try {
                const funcStr = document.getElementById('functionInput').value;
                if (!funcStr.trim()) {
                    showMessage('Please enter a function first.', 'error');
                    return;
                }

                const func = parseFunction(funcStr);
                const { x0, x1 } = findValidGuesses(func);
                
                document.getElementById('initialGuess1').value = x0.toFixed(4);
                document.getElementById('initialGuess2').value = x1.toFixed(4);
                
                showMessage(`Suggested initial guesses: x₀ = ${x0.toFixed(4)}, x₁ = ${x1.toFixed(4)}`, 'success');
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

        // Add auto-suggest button when page loads
        window.addEventListener('load', function() {
            const container = document.querySelector('.method-section');
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'text-align: center; margin-top: 10px;';
            
            const autoSuggestBtn = document.createElement('button');
            autoSuggestBtn.className = 'btn';
            autoSuggestBtn.textContent = 'Auto-Suggest Initial Guesses';
            autoSuggestBtn.onclick = autoSuggestGuesses;
            autoSuggestBtn.style.cssText = 'background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);';
            
            buttonContainer.appendChild(autoSuggestBtn);
            container.appendChild(buttonContainer);
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
                    borderColor: '#14b8a6',
                    backgroundColor: 'rgba(20, 184, 166, 0.2)',
                    tension: 0.1,
                    pointRadius: 0,
                    borderWidth: 3
                },
                {
                    label: 'Root',
                    data: [{x: root, y: func(root)}],
                    borderColor: '#f59e0b',
                    backgroundColor: '#f59e0b',
                    pointRadius: 10,
                    showLine: false,
                    pointBorderWidth: 2,
                    pointBorderColor: '#ffffff'
                },
                {
                    label: 'Iterations',
                    data: iterations.map(iter => ({x: iter.x2, y: iter.f2})),
                    borderColor: '#22d3ee',
                    backgroundColor: '#22d3ee',
                    pointRadius: 6,
                    showLine: false,
                    pointBorderWidth: 2,
                    pointBorderColor: '#ffffff'
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
                    plugins: { 
                        legend: { 
                            display: true,
                            labels: {
                                color: '#e2e8f0',
                                font: {
                                    size: 14
                                }
                            }
                        }
                    },
                    scales: {
                        x: { 
                            type: 'linear', 
                            position: 'bottom', 
                            title: { 
                                display: true, 
                                text: 'x',
                                color: '#e2e8f0',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                            ticks: {
                                color: '#94a3b8'
                            },
                            grid: {
                                color: 'rgba(71, 85, 105, 0.3)'
                            }
                        },
                        y: { 
                            title: { 
                                display: true, 
                                text: 'f(x)',
                                color: '#e2e8f0',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                            ticks: {
                                color: '#94a3b8'
                            },
                            grid: {
                                color: 'rgba(71, 85, 105, 0.3)'
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