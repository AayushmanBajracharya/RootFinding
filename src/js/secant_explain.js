// Secant Method Explanation Page JavaScript
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
            background: #10b981;
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

    // Add interactive examples
    addInteractiveExamples();
});

function addInteractiveExamples() {
    // Add a simple calculator for secant method
    const exampleSection = document.querySelector('.example-box');
    if (exampleSection) {
        const calculator = document.createElement('div');
        calculator.innerHTML = `
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <h4>Interactive Calculator</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0;">
                    <input type="number" id="x0-input" placeholder="x₀" value="1" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                    <input type="number" id="x1-input" placeholder="x₁" value="2" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                </div>
                <input type="text" id="func-input" placeholder="Enter function (e.g., x^3-x-2)" value="x^3-x-2" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; margin: 10px 0;">
                <button onclick="calculateSecant()" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Calculate Root</button>
                <div id="result-display" style="margin-top: 15px; padding: 10px; background: white; border-radius: 4px; border: 1px solid #ddd;"></div>
            </div>
        `;
        exampleSection.appendChild(calculator);
    }
}

function calculateSecant() {
    const x0 = parseFloat(document.getElementById('x0-input').value);
    const x1 = parseFloat(document.getElementById('x1-input').value);
    const funcStr = document.getElementById('func-input').value;
    const resultDiv = document.getElementById('result-display');
    
    try {
        // Simple function parser (basic implementation)
        const func = new Function('x', `return ${funcStr.replace(/\^/g, '**')}`);
        
        // Simple secant method implementation
        let x_prev = x0;
        let x_curr = x1;
        let iterations = 0;
        const maxIter = 50;
        const tolerance = 1e-8;
        
        while (iterations < maxIter) {
            const f_prev = func(x_prev);
            const f_curr = func(x_curr);
            
            if (Math.abs(f_curr - f_prev) < 1e-15) {
                resultDiv.innerHTML = '<span style="color: red;">Error: Division by zero (f(x₁) ≈ f(x₀))</span>';
                return;
            }
            
            const x_next = x_curr - f_curr * (x_curr - x_prev) / (f_curr - f_prev);
            const error = Math.abs(x_next - x_curr);
            
            if (error < tolerance) {
                resultDiv.innerHTML = `
                    <strong>Root found:</strong> ${x_next.toFixed(8)}<br>
                    <strong>Iterations:</strong> ${iterations + 1}<br>
                    <strong>Function value:</strong> ${func(x_next).toExponential(3)}<br>
                    <strong>Error:</strong> ${error.toExponential(3)}
                `;
                return;
            }
            
            x_prev = x_curr;
            x_curr = x_next;
            iterations++;
        }
        
        resultDiv.innerHTML = '<span style="color: orange;">Maximum iterations reached. May not have converged.</span>';
        
    } catch (error) {
        resultDiv.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    }
}