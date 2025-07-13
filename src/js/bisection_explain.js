// Bisection Method Explanation Page JavaScript
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
            background: #3b82f6;
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

    // Add interactive bisection calculator
    addInteractiveCalculator();
});

function addInteractiveCalculator() {
    const exampleSection = document.querySelector('.example-box');
    if (exampleSection) {
        const calculator = document.createElement('div');
        calculator.innerHTML = `
            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-top: 20px; border: 1px solid #3b82f6;">
                <h4 style="color: #1e40af; margin-bottom: 15px;">Interactive Bisection Calculator</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0;">
                    <input type="number" id="a-input" placeholder="Lower bound (a)" value="1" style="padding: 8px; border-radius: 4px; border: 1px solid #3b82f6;">
                    <input type="number" id="b-input" placeholder="Upper bound (b)" value="2" style="padding: 8px; border-radius: 4px; border: 1px solid #3b82f6;">
                </div>
                <input type="text" id="func-input" placeholder="Enter function (e.g., x^3-x-2)" value="x^3-x-2" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #3b82f6; margin: 10px 0;">
                <input type="number" id="tolerance-input" placeholder="Tolerance" value="0.0001" step="0.0001" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #3b82f6; margin: 10px 0;">
                <button onclick="calculateBisection()" style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; width: 100%;">Find Root with Bisection</button>
                <div id="bisection-result" style="margin-top: 15px; padding: 10px; background: white; border-radius: 4px; border: 1px solid #ddd;"></div>
            </div>
        `;
        exampleSection.appendChild(calculator);
    }
}

function calculateBisection() {
    const a = parseFloat(document.getElementById('a-input').value);
    const b = parseFloat(document.getElementById('b-input').value);
    const funcStr = document.getElementById('func-input').value;
    const tolerance = parseFloat(document.getElementById('tolerance-input').value);
    const resultDiv = document.getElementById('bisection-result');
    
    try {
        // Simple function parser
        const func = new Function('x', `return ${funcStr.replace(/\^/g, '**')}`);
        
        // Check initial conditions
        const fa = func(a);
        const fb = func(b);
        
        if (fa * fb >= 0) {
            resultDiv.innerHTML = '<span style="color: red;">Error: f(a) and f(b) must have opposite signs!</span>';
            return;
        }
        
        // Bisection method implementation
        let left = a;
        let right = b;
        let iterations = 0;
        const maxIter = 1000;
        let iterationData = [];
        
        while (iterations < maxIter && Math.abs(right - left) > tolerance) {
            const mid = (left + right) / 2;
            const fmid = func(mid);
            
            iterationData.push({
                iter: iterations + 1,
                a: left.toFixed(6),
                b: right.toFixed(6),
                mid: mid.toFixed(6),
                fmid: fmid.toFixed(6),
                error: ((right - left) / 2).toFixed(6)
            });
            
            if (Math.abs(fmid) < tolerance) {
                break;
            }
            
            if (func(left) * fmid < 0) {
                right = mid;
            } else {
                left = mid;
            }
            
            iterations++;
        }
        
        const root = (left + right) / 2;
        
        // Display results
        let tableHTML = `
            <strong>Root found:</strong> ${root.toFixed(8)}<br>
            <strong>Iterations:</strong> ${iterations}<br>
            <strong>Function value:</strong> ${func(root).toExponential(3)}<br>
            <strong>Final interval width:</strong> ${(right - left).toExponential(3)}<br><br>
            <strong>Iteration Details:</strong><br>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <tr style="background: #f3f4f6;">
                    <th style="border: 1px solid #ddd; padding: 5px;">Iter</th>
                    <th style="border: 1px solid #ddd; padding: 5px;">a</th>
                    <th style="border: 1px solid #ddd; padding: 5px;">b</th>
                    <th style="border: 1px solid #ddd; padding: 5px;">midpoint</th>
                    <th style="border: 1px solid #ddd; padding: 5px;">f(mid)</th>
                    <th style="border: 1px solid #ddd; padding: 5px;">error</th>
                </tr>
        `;
        
        iterationData.slice(0, 10).forEach(row => {
            tableHTML += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 5px; text-align: center;">${row.iter}</td>
                    <td style="border: 1px solid #ddd; padding: 5px;">${row.a}</td>
                    <td style="border: 1px solid #ddd; padding: 5px;">${row.b}</td>
                    <td style="border: 1px solid #ddd; padding: 5px;">${row.mid}</td>
                    <td style="border: 1px solid #ddd; padding: 5px;">${row.fmid}</td>
                    <td style="border: 1px solid #ddd; padding: 5px;">${row.error}</td>
                </tr>
            `;
        });
        
        tableHTML += '</table>';
        if (iterationData.length > 10) {
            tableHTML += `<br><em>Showing first 10 iterations (total: ${iterationData.length})</em>`;
        }
        
        resultDiv.innerHTML = tableHTML;
        
    } catch (error) {
        resultDiv.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    }
}