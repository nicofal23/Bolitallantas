document.addEventListener('DOMContentLoaded', () => {
const llantasContainer = document.getElementById('llantasContainer');
const modeloSelect = document.getElementById('modeloSelect');
const buscador = document.getElementById('buscador');
const numeroPiezaInput = document.getElementById('numeroPieza');
const filtrarNumeroPiezaBtn = document.getElementById('filtrarNumeroPieza');

// Cargar datos desde el archivo modelos.json
fetch('modelos.json')
  .then(response => response.json())
  .then(data => {
    // Llenar el select con modelos únicos
    const modelosUnicos = [...new Set(data.vehiculos.map(item => item.modelo))];
    modelosUnicos.forEach(modelo => {
      const option = document.createElement('option');
      option.value = modelo;
      option.textContent = modelo;
      modeloSelect.appendChild(option);
    });

    // Llenar las tarjetas
    llenarTarjetas(data.vehiculos);

    // Agregar eventos para filtrar al cambiar el modelo o escribir en el buscador
    modeloSelect.addEventListener('change', () => {
      const modeloSeleccionado = modeloSelect.value;
      const vehiculoSeleccionado = data.vehiculos.find(item => item.modelo === modeloSeleccionado);
      llenarTarjetas([vehiculoSeleccionado]);
    });

    buscador.addEventListener('input', () => {
      const filtro = buscador.value.toLowerCase();
      const vehiculosFiltrados = data.vehiculos.filter(item => 
        item.productos.some(producto => producto.DESCRIPCION.toLowerCase().includes(filtro))
      );
      llenarTarjetas(vehiculosFiltrados);
    });

    filtrarNumeroPiezaBtn.addEventListener('click', () => {
      const numeroPieza = numeroPiezaInput.value.toLowerCase();
      const vehiculosFiltrados = data.vehiculos.filter(item => 
        item.productos.some(producto => producto['NUMERO DE PIEZA'].toLowerCase().includes(numeroPieza))
      );
      llenarTarjetas(vehiculosFiltrados);
    });
  })
  .catch(error => console.error('Error al cargar los datos:', error));

function llenarTarjetas(vehiculos) {
  llantasContainer.innerHTML = '';

  vehiculos.forEach(vehiculo => {
    vehiculo.productos.forEach(producto => {
      const card = document.createElement('div');
      card.classList.add('card');

      const image = document.createElement('img');
      image.src = producto.IMAGEN;
      image.alt = producto.DESCRIPCION;

      const cardContent = document.createElement('div');
      cardContent.classList.add('card-content');

      const title = document.createElement('div');
      title.classList.add('card-title');
      title.textContent = producto.DESCRIPCION;

      const description = document.createElement('div');
      description.classList.add('card-description');
      description.textContent = `Precio + IVA: ${producto['PRECIO + IVA']}, Precio con IVA: ${producto['PRECIO CON IVA']}`;

      cardContent.appendChild(title);
      cardContent.appendChild(description);

      card.appendChild(image);
      card.appendChild(cardContent);

      llantasContainer.appendChild(card);
    });
  });
}
llantasContainer.addEventListener('click', (event) => {
  if (event.target.tagName === 'IMG') {
    const modal = document.getElementById('myModal');
    const modalImage = document.getElementById('modalImage');

    modal.style.display = 'block';
    modalImage.src = event.target.src;
  }
});

const closeModal = document.getElementById('closeModal');
closeModal.addEventListener('click', () => {
  const modal = document.getElementById('myModal');
  modal.style.display = 'none';
});
});
  