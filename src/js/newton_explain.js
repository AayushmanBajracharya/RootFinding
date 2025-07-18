// Newton-Raphson Method Explanation Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Add smooth scrolling for internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add copy functionality to code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.textContent = 'Copy';
        button.className = 'copy-btn';
        button.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #8b5cf6;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;
        
        block.parentElement.style.position = 'relative';
        block.parentElement.appendChild(button);
        
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => button.textContent = 'Copy', 2000);
            });
        });
    });

    // Add interactive Newton-Raphson calculator
    addInteractiveCalculator();
});

function addInteractiveCalculator() {
    const sections = document.querySelectorAll('section');
    if (sections.length > 3) {
        const calculator = document.createElement('div');
        calculator.innerHTML = `
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #8b5cf6;">
                <h4 style="color: #7c3aed; margin-bottom: 15px;">Interactive Newton-Raphson Calculator</h4>
                <input type="text" id="func-input" placeholder="Enter function (e.g., x^3-x-2)" value="x^3-x-2" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #8b5cf6; margin: 10px 0;">
                <input type="text" id="deriv-input" placeholder="Enter derivative (e.g., 3*x^2-1)" value="3*x^2-1" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #8b5cf6; margin: 10px 0;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0;">
                    <input type="number" id="x0-input" placeholder="Initial guess (x₀)" value="1.5" style="padding: 8px; border-radius: 4px; border: 1px solid #8b5cf6;">
                    <input type="number" id="tolerance-input" placeholder="Tolerance" value="0.0001" step="0.0001" style="padding: 8px; border-radius: 4px; border: 1px solid #8b5cf6;">
                </div>
                <button onclick="calculateNewton()" style="background: #8b5cf6; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; width: 100%;">Find Root with Newton-Raphson</button>
                <div id="newton-result" style="margin-top: 15px; padding: 10px; background: white; border-radius: 4px; border: 1px solid #ddd;"></div>
            </div>
        `;
        sections[3].appendChild(calculator);
    }
}

function calculateNewton() {
    const funcStr = document.getElementById('func-input').value;
    const derivStr = document.getElementById('deriv-input').value;
    const x0 = parseFloat(document.getElementById('x0-input').value);
    const tolerance = parseFloat(document.getElementById('tolerance-input').value);
    const resultDiv = document.getElementById('newton-result');
    
    try {
        // Simple function parsers
        const func = new Function('x', `return ${funcStr.replace(/\^/g, '**')}`);
        const deriv = new Function('x', `return ${derivStr.replace(/\^/g, '**')}`);
        
        // Newton-Raphson method implementation
        let x = x0;
        let iterations = 0;
        const maxIter = 100;
        let iterationData = [];
        
        while (iterations < maxIter) {
            const fx = func(x);
            const fpx = deriv(x);
            
            iterationData.push({
                iter: iterations,
                x: x.toFixed(8),
                fx: fx.toFixed(8),
                fpx: fpx.toFixed(8)
            });
            
            if (Math.abs(fx) < tolerance) {
                break;
            }
            
            if (Math.abs(fpx) < 1e-15) {
                resultDiv.innerHTML = '<span style="color: red;">Error: Derivative is zero or near zero!</span>';
                return;
            }
            
            const x_new = x - fx / fpx;
            const error = Math.abs(x_new - x);
            
            iterationData[iterations].x_new = x_new.toFixed(8);
            iterationData[iterations].error = error.toFixed(8);
            
            if (error < tolerance) {
                x = x_new;
                break;
            }
            
            x = x_new;
            iterations++;
        }
        
        // Display results
        let tableHTML = `
            <strong>Root found:</strong> ${x.toFixed(8)}<br>
            <strong>Iterations:</strong> ${iterations + 1}<br>
            <strong>Function value:</strong> ${func(x).toExponential(3)}<br>
            <strong>Final error:</strong> ${iterations > 0 ? iterationData[iterations-1].error : '0'}<br><br>
            <strong>Iteration Details:</strong><br>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <tr style="background: #f3f4f6;">
                    <th style="border: 1px solid #ddd; padding: 5px;">Iter</th>
                    <th style="border: 1px solid #ddd; padding: 5px;">x_n</th>
                    <th style="border: 1px solid #ddd; padding: 5px;">f(x_n)</th>
                    <th style="border: 1px solid #ddd; padding: 5px;">f'(x_n)</th>
                    <th style="border: 1px solid #ddd; padding: 5px;">x_{n+1}</th>
                    <th style="border: 1px solid #ddd; padding: 5px;">Error</th>
                </tr>
        `;
        
        iterationData.slice(0, 15).forEach(row => {
            tableHTML += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 5px; text-align: center;">${row.iter}</td>
                    <td style="border: 1px solid #ddd; padding: 5px;">${row.x}</td>
                    <td style="border: 1px solid #ddd; padding: 5px;">${row.fx}</td>
                    <td style="border: 1px solid #ddd; padding: 5px;">${row.fpx}</td>
                    <td style="border: 1px solid #ddd; padding: 5px;">${row.x_new || '-'}</td>
                    <td style="border: 1px solid #ddd; padding: 5px;">${row.error || '-'}</td>
                </tr>
            `;
        });
        
        tableHTML += '</table>';
        if (iterationData.length > 15) {
            tableHTML += `<br><em>Showing first 15 iterations (total: ${iterationData.length})</em>`;
        }
        
        resultDiv.innerHTML = tableHTML;
        
    } catch (error) {
        resultDiv.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    }
}