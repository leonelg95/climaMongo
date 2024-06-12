import { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const apiKey = 'c83856048b2feb271b81fcd606704e0b';

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchWeather = async (selectedCity) => {
    try {
      console.log('Obteniendo datos meteorológicos para la ciudad:', selectedCity);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=metric`);
      const data = await response.json();
      if (response.ok) {
        setWeatherData(data);
        setError(null);
        saveToHistory(selectedCity);
      } else {
        setWeatherData(null);
        setError(data.message);
      }
    } catch (error) {
      console.error('Error al recuperar datos meteorológicos:', error);
      setError('Error al obtener los datos meteorológicos. Inténtalo de nuevo más tarde.');
    }
  };

  const saveToHistory = async (city) => {
    try {
      console.log('Datos a enviar en la solicitud POST:', { city });
      const response = await fetch('http://localhost:3000/historial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city }),
      });
      if (response.ok) {
        console.log('Solicitud POST exitosa');
        fetchHistory();
      } else {
        console.error('Error en la solicitud POST:', response.statusText);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud POST:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      console.log('Recuperando historial');
      const response = await fetch('http://localhost:3000/historial');
      const data = await response.json();
      if (response.ok) {
        setHistory(data);
      } else {
        console.error('Error al obtener el historial:', response.statusText);
      }
    } catch (error) {
      console.error('Error al recuperar el historial:', error);
    }
  };

  const handleSearch = () => {
    fetchWeather(city);
  };

  const handleCityClick = (selectedCity) => {
    setCity(selectedCity);
    fetchWeather(selectedCity);
  };

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain) {
      case 'Clear':
        return 'public/icons/soleado.svg';
      case 'Clouds':
        return 'public/icons/nublado.svg';
      case 'Rain':
        return 'public/icons/lluvia.svg';
      case 'Snow':
        return 'public/icons/nevando.svg';
      case 'Thunderstorm':
        return 'public/icons/tormentaelectrica.svg';
      default:
        return 'public/icons/soleado.svg';
    }
  };

  const handleClearHistory = async () => {
    try {
      const response = await fetch('http://localhost:3000/historial', {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Historial eliminado con éxito');
        setHistory([]);
      } else {
        console.error('Error al eliminar el historial:', response.statusText);
      }
    } catch (error) {
      console.error('Error al eliminar el historial:', error);
    }
  };

  return (
    <div className="container">
      <nav className="nav">
        <ul>
          <li><strong>Clima</strong></li>
        </ul>
        <ul>
          <li><a href="#" onClick={() => handleCityClick('Tucuman')}>Tucumán</a></li>
          <li><a href="#" onClick={() => handleCityClick('Salta')}>Salta</a></li>
          <li><a href="#" onClick={() => handleCityClick('Buenos Aires')}>Buenos Aires</a></li>
        </ul>
      </nav>

      <div className="search">
        <input
          className="input"
          type="search"
          name="search"
          placeholder="Buscar..."
          aria-label="Search"
          value={city}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="history-section">
        <button className="history-button" onClick={() => setIsHistoryVisible(!isHistoryVisible)}>
          {isHistoryVisible ? 'Ocultar Historial' : 'Mostrar Historial'}
        </button>
        <button className="borrar" onClick={handleClearHistory}>
          Borrar Historial
        </button>
        {isHistoryVisible && (
          <div className="history-dropdown">
            <select className="history-select" size="5">
              {history.map((item, index) => (
                <option key={index}>{item.city}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="content">
        <div className="weather">
          {error && <p>{error}</p>}
          {weatherData && (
            <div className="card">
              <header>
                <h2>{weatherData.name}</h2>
              </header>
              <div className="icon">
                <img src={getWeatherIcon(weatherData.weather[0].main)} alt="icon-weather" />
              </div>
              <footer>
                <h3>Temperatura: {weatherData.main.temp}°C</h3>
                <p>Mínima: {weatherData.main.temp_min}°C / Máxima: {weatherData.main.temp_max}°C</p>
                <p>Humedad: {weatherData.main.humidity}%</p>
              </footer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
