// Aguarda o evento de carregamento do DOM para executar o código
document.addEventListener('DOMContentLoaded', () => {
    // Cria um mapa 3D utilizando a biblioteca Windy.js
    const earth = new WE.map('map3D');
    
    // Adiciona uma camada de azulejos (tiles) do OpenStreetMap ao mapa
    WE.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>'
    }).addTo(earth);
    
    // Adiciona um ícone da ISS como um marcador inicialmente em [0, 0] no mapa
    const issIcon = WE.marker([0, 0], 'https://media.wheretheiss.at/v/423aa9eb/img/iss.png', 165, 110).addTo(earth);
    
    // URL da API para obter os dados da ISS
    const endPoint = 'https://api.wheretheiss.at/v1/satellites/25544';
    
    let flagPrimeira = true; // Variável para controlar a primeira exibição da posição da ISS
    let intervalID; // ID do intervalo para atualização periódica da posição da ISS
    
    // Função assíncrona para obter dados da ISS da API
    async function getISS() {
      try {
        const response = await fetch(endPoint); // Faz uma requisição para a API
        if (!response.ok) {
          throw new Error('Não foi possível obter os dados da ISS.'); // Lança um erro se a resposta não estiver ok
        }
    
        const data = await response.json(); // Converte a resposta para JSON
        const { latitude, longitude, altitude, velocity } = data; // Extrai os dados de latitude, longitude, altitude e velocidade da resposta
    
        // Atualiza a posição do marcador da ISS no mapa
        issIcon.setLatLng([latitude, longitude]);
        earth.setView([latitude, longitude]); // Atualiza a visualização do mapa para a posição da ISS
    
        // Define a visualização inicial do mapa apenas na primeira vez
        if (flagPrimeira) {
          earth.setView([latitude, longitude], 2.5);
          flagPrimeira = false;
        }
    
        // Atualiza os valores de latitude, longitude, altitude e velocidade no HTML
        document.getElementById('lat').textContent = latitude.toFixed(3);
        document.getElementById('lon').textContent = longitude.toFixed(3);
        document.getElementById('alt').textContent = altitude.toFixed(2);
        document.getElementById('vel').textContent = velocity.toFixed(2);
    
      } catch (error) {
        console.error('Erro ao obter dados da ISS:', error.message);
        // Adicione ações para lidar com erros, como mostrar uma mensagem de erro ao usuário.
      }
    }
    
    // Função para iniciar o intervalo de atualização da posição da ISS a cada 10 segundos
    function startISSInterval() {
      getISS(); // Chama a função uma vez para carregar as informações inicialmente.
      intervalID = setInterval(getISS, 10000); // Chama a função a cada 10 segundos.
    }
    
    startISSInterval(); // Inicia o intervalo de atualização da posição da ISS
    
    // Limpa o intervalo quando a página é fechada ou mudada
    window.addEventListener('beforeunload', () => {
      clearInterval(intervalID); // Limpa o intervalo de atualização
    });
  });
  