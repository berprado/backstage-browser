const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const toolbar = document.createElement('div');
  toolbar.style.position = 'fixed';
  toolbar.style.left = '50%';
  toolbar.style.bottom = '20px';
  toolbar.style.transform = 'translateX(-50%)';
  toolbar.style.zIndex = '1000';
  toolbar.style.display = 'flex';
  toolbar.style.gap = '18px';
  toolbar.style.padding = '14px 24px';
  toolbar.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  toolbar.style.borderRadius = '16px';
  toolbar.style.boxShadow = '0 6px 24px rgba(0,0,0,0.18)';


    // Para rutas absolutas de iconos locales
    const path = require('path');

    const createButton = (imgSrc, alt, action) => {
      const button = document.createElement('button');
      button.style.padding = '10px';
      button.style.backgroundColor = '#39ff14';
      button.style.border = 'none';
      button.style.borderRadius = '8px';
      button.style.cursor = 'pointer';
      button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      button.style.transition = 'transform 0.2s';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';

      const img = document.createElement('img');
      // Ruta absoluta usando file:// y __dirname
      img.src = `file://${path.join(__dirname, 'assets', 'images', imgSrc)}`;
      img.alt = alt;
      img.style.width = '32px';
      img.style.height = '32px';
      img.style.display = 'block';
      img.style.pointerEvents = 'none';

      button.appendChild(img);

      button.addEventListener('click', action);
      button.addEventListener('touchstart', action);

      button.onmouseover = () => button.style.transform = 'scale(1.13)';
      button.onmouseout = () => button.style.transform = 'scale(1)';

      return button;
    };

  const backButtonToolbar = createButton('icons8-slide-back-96.png', 'Atrás', () => history.back());
  const reloadButton = createButton('icons8-refresh-96.png', 'Recargar', () => location.reload());
  const homeButton = createButton('icons8-home-96.png', 'Inicio', () => location.href = 'https://www.youtube.com/');
  const topButton = createButton('icons8-slide-up-96.png', 'Arriba', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  toolbar.appendChild(backButtonToolbar);
  toolbar.appendChild(reloadButton);
  toolbar.appendChild(homeButton);
  toolbar.appendChild(topButton);

  document.body.appendChild(toolbar);
});