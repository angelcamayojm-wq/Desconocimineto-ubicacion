import { productosBodega } from './bodegaData.js';

document.addEventListener('DOMContentLoaded', () => {
  const selectProd = document.getElementById('select-producto');
  const btnEscanear = document.getElementById('btn-escanear');
  const resultadoPda = document.getElementById('resultado-pda');
  const mapaBoxes = document.querySelectorAll('.map-box');
  const auditBody = document.getElementById('audit-log-body');

  // Llenar selector
  productosBodega.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.nombre} (${p.id})`;
    selectProd.appendChild(opt);
  });

  function addLog(sku, ubicacion, evento) {
    const time = new Date().toLocaleTimeString();
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="mono">${time}</td>
      <td class="mono"><strong>${sku}</strong></td>
      <td class="mono" style="color:var(--color-sienna-brown);">${ubicacion}</td>
      <td>${evento}</td>
    `;
    auditBody.prepend(tr);
  }

  // Evento Escáner PDA
  btnEscanear.addEventListener('click', () => {
    const id = selectProd.value;
    const prod = productosBodega.find(p => p.id === id);

    if (prod) {
      resultadoPda.innerHTML = `
        <div style="font-family:var(--font-mono); font-size:16px; font-weight:bold; color:var(--color-sienna-brown);">
          📍 ${prod.codigoUbicacion}
        </div>
        <p style="margin-top:8px;"><strong>Producto:</strong> ${prod.nombre}</p>
        <p><strong>Posición:</strong> Pasillo ${prod.pasillo} | Estante ${prod.estante} | Nivel ${prod.nivel}</p>
        <p style="color:green; font-size:12px; margin-top:4px;">✓ Sincronizado en tiempo real con WMS</p>
      `;

      mapaBoxes.forEach(box => {
        if (box.dataset.pasillo === prod.pasillo) {
          box.classList.add('active');
        } else {
          box.classList.remove('active');
        }
      });

      addLog(prod.id, prod.codigoUbicacion, "Búsqueda desde Escáner PDA");
    }
  });

  // Evento Ingreso Nuevo Producto
  const btnIngresar = document.getElementById('btn-ingresar');
  btnIngresar.addEventListener('click', () => {
    const nombre = document.getElementById('in-nombre').value;
    const pas = (document.getElementById('in-pasillo').value || '01').padStart(2, '0');
    const est = (document.getElementById('in-estante').value || 'A').toUpperCase();
    const niv = (document.getElementById('in-nivel').value || '01').padStart(2, '0');

    if (!nombre) {
      alert("Por favor ingresa un nombre de producto");
      return;
    }

    const skuNew = `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
    const codNew = `PAS-${pas}-EST-${est}-NIV-${niv}`;

    productosBodega.push({
      id: skuNew,
      nombre,
      categoria: "General",
      pasillo: pas,
      estante: est,
      nivel: niv,
      codigoUbicacion: codNew,
      estado: "Ubicado",
      stock: 50
    });

    const opt = document.createElement('option');
    opt.value = skuNew;
    opt.textContent = `${nombre} (${skuNew})`;
    selectProd.appendChild(opt);

    document.getElementById('res-ingreso').innerHTML = `
      <div style="color:var(--color-sienna-brown); font-family:var(--font-mono);">
        ✓ Producto registrado exitosamente con el código <strong>${codNew}</strong> (${skuNew})
      </div>
    `;

    addLog(skuNew, codNew, `Ingreso de nuevo producto: ${nombre}`);
  });
});