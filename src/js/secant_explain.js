 // Add smooth scrolling for any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });

    // Add copy functionality to code blocks
    document.querySelectorAll('pre code').forEach(block => {
      const button = document.createElement('button');
      button.innerHTML = '📋 Copy';
      button.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: #4a5568;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
      `;
      
      block.parentNode.style.position = 'relative';
      block.parentNode.appendChild(button);
      
      button.addEventListener('click', () => {
        navigator.clipboard.writeText(block.textContent);
        button.innerHTML = '✅ Copied!';
        setTimeout(() => button.innerHTML = '📋 Copy', 2000);
      });
    });