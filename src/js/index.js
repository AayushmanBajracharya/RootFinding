// Initialize Lucide icons
lucide.createIcons();

let selectedMethods = [];
let expandedMethod = null;

const methods = {
  bisection: { name: 'Bisection Method', color: 'blue' },
  secant: { name: 'Secant Method', color: 'green' },
  newton: { name: 'Newton Raphson Method', color: 'purple' }
};

const methodButtons = document.querySelectorAll('.method-btn');
const compareBtn = document.getElementById('compareBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsTableBody = document.getElementById('resultsTableBody');
const expandableHeaders = document.querySelectorAll('.expandable-header');

// Method selection logic
methodButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const method = btn.dataset.method;
    const equation = document.getElementById('equationInput').value.trim();

    if (method === 'bisection') {
  if (!equation) {
    alert('Please enter an equation first!');
    return;
  }
  window.location.href = `bisection.html?function=${encodeURIComponent(equation)}`;
  return;
}


    if (selectedMethods.includes(method)) {
      selectedMethods = selectedMethods.filter(m => m !== method);
      btn.classList.remove('selected');
    } else {
      selectedMethods.push(method);
      btn.classList.add('selected');
    }

    updateCompareButton();
  });
});

// Expand/collapse logic
expandableHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const method = header.dataset.method;
    const content = header.nextElementSibling;
    const chevron = header.querySelector('.chevron');

    if (expandedMethod === method) {
      content.classList.remove('show');
      chevron.classList.remove('rotated');
      expandedMethod = null;
    } else {
      document.querySelectorAll('.expandable-content').forEach(c => c.classList.remove('show'));
      document.querySelectorAll('.chevron').forEach(c => c.classList.remove('rotated'));

      content.classList.add('show');
      chevron.classList.add('rotated');
      expandedMethod = method;
    }
  });
});

// Compare button logic
compareBtn.addEventListener('click', () => {
  if (selectedMethods.length > 0) showResults();
});

// Enable/disable compare button
function updateCompareButton() {
  compareBtn.disabled = selectedMethods.length === 0;
}

// Show results
function showResults() {
  resultsSection.classList.remove('hidden');
  resultsTableBody.innerHTML = '';

  selectedMethods.forEach(methodId => {
    const method = methods[methodId];
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <div class="method-name">
          <div class="method-indicator ${method.color}"></div>
          <span>${method.name}</span>
        </div>
      </td>
      <td class="root-value">-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    `;
    resultsTableBody.appendChild(row);
  });

  resultsSection.scrollIntoView({ behavior: 'smooth' });
}

updateCompareButton();
