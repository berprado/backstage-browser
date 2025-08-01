const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const toolbar = document.createElement('div');
  toolbar.style.position = 'fixed';
  toolbar.style.top = 'unset';
  toolbar.style.bottom = '10px';
  toolbar.style.right = '10px';
  toolbar.style.zIndex = '1000';
  toolbar.style.display = 'flex';
  toolbar.style.gap = '10px';
  toolbar.style.padding = '10px';
  toolbar.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  toolbar.style.borderRadius = '8px';

  const createButton = (text, action) => {
    const button = document.createElement('button');
    button.innerText = text;
    button.style.padding = '15px';
    button.style.fontSize = '18px';
    button.style.color = '#000';
    button.style.backgroundColor = '#39ff14'; // Verde neón
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    button.style.transition = 'transform 0.2s';

    button.addEventListener('click', action);
    button.addEventListener('touchstart', action); // Compatibilidad con touchscreen

    button.onmouseover = () => button.style.transform = 'scale(1.1)';
    button.onmouseout = () => button.style.transform = 'scale(1)';

    return button;
  };

  const backButtonToolbar = createButton('⏪', () => history.back());
  const reloadButton = createButton('🔁', () => location.reload());
  const homeButton = createButton('🏠', () => location.href = 'https://www.youtube.com/');
  const topButton = createButton('🔝', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  toolbar.appendChild(backButtonToolbar);
  toolbar.appendChild(reloadButton);
  toolbar.appendChild(homeButton);
  toolbar.appendChild(topButton);

  document.body.appendChild(toolbar);
});