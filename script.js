document.addEventListener('DOMContentLoaded', () => {
  const llantasContainer = document.getElementById('llantasContainer');
  const modeloSelect = document.getElementById('modeloSelect');
  const buscador = document.getElementById('buscador');
  const numeroPiezaInput = document.getElementById('numeroPieza');
  const filtrarNumeroPiezaBtn = document.getElementById('filtrarNumeroPieza');
  const imagenseguneleccion = document.getElementById("imagenseguneleccion");

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

        // Actualizar la imagen según el modelo seleccionado
        actualizarImagenSegunSeleccion(modeloSeleccionado, data.vehiculos);
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
        description.innerHTML = `
          <p>Número de pieza: ${producto["NUMERO DE PIEZA"]}</p>
          <p>Precio + IVA: ${producto['PRECIO + IVA']}</p>
          <p>Precio con IVA: ${producto['PRECIO CON IVA']}</p>
        `;

        cardContent.appendChild(title);
        cardContent.appendChild(description);

        card.appendChild(image);
        card.appendChild(cardContent);

        llantasContainer.appendChild(card);
      });
    });
  }

  // Función para abrir el modal
  function abrirModal(imagenSrc) {
    const modal = document.getElementById('myModal');
    const modalImage = document.getElementById('modalImage');

    modal.style.display = 'block';
    modalImage.src = imagenSrc;
  }

  // Evento clic en la imagen para abrir el modal
  llantasContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'IMG') {
      abrirModal(event.target.src);
    }
  });

  const closeModal = document.getElementById('closeModal');
  closeModal.addEventListener('click', () => {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
  });

  // Cierra el modal si se hace clic fuera de la imagen o del modal
  window.addEventListener('click', (event) => {
    const modal = document.getElementById('myModal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Función para actualizar la imagen según el modelo seleccionado
  function actualizarImagenSegunSeleccion(modeloSeleccionado, vehiculos) {
    const imagenModelo = obtenerImagenModelo(modeloSeleccionado, vehiculos);

    // Verifica si existe una imagen para el modelo seleccionado
    if (imagenModelo) {
      imagenseguneleccion.innerHTML = `<img src="${imagenModelo}" alt="${modeloSeleccionado}">`;
    } else {
      // Si no hay imagen para el modelo seleccionado, limpia el contenedor
      imagenseguneleccion.innerHTML = "";
    }
  }

  // Función para obtener la imagen del modelo
  function obtenerImagenModelo(modeloSeleccionado, vehiculos) {
    const vehiculoEncontrado = vehiculos.find(item => item.modelo === modeloSeleccionado);
    return vehiculoEncontrado ? vehiculoEncontrado.imagenmodelo : null;
  }
});
