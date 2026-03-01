document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     DARK MODE
  ========================= */

  const toggle = document.getElementById("toggleDark");

  toggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");
  });


  /* =========================
     WEATHER - OPENWEATHER
  ========================= */

  const cidadeInput = document.getElementById("cidadeInput");
  const weatherMain = document.getElementById("weatherMain");
  const weatherPanel = document.getElementById("weatherPanel");

  const apiKey = "3e1c2eefc684c161feedcb32030b6d57"; 

  function getWeatherEmoji(main) {
    switch (main) {
      case "Clear": return "☀️";
      case "Rain": return "🌧️";
      case "Clouds": return "☁️";
      case "Thunderstorm": return "⛈️";
      case "Snow": return "❄️";
      case "Drizzle": return "🌦️";
      default: return "🌤️";
    }
  }

  async function buscarClima(cidade) {
    if (!cidade) return;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&lang=pt_br&appid=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("Cidade não encontrada");
      }

      const data = await response.json();

      const temp = Math.round(data.main.temp);
      const descricao = data.weather[0].description;
      const climaPrincipal = data.weather[0].main;
      const umidade = data.main.humidity;
      const sensacao = Math.round(data.main.feels_like);
      const vento = data.wind.speed;

      const emoji = getWeatherEmoji(climaPrincipal);

      // Mostra emoji + temperatura
      weatherMain.textContent = `${emoji} ${temp}°C`;

      // Painel ao passar o mouse
      weatherPanel.innerHTML = `
        <strong>${data.name}</strong><br><br>
        🌡️ Temperatura: ${temp}°C<br>
        🤗 Sensação térmica: ${sensacao}°C<br>
        💧 Umidade: ${umidade}%<br>
        🌬️ Vento: ${vento} m/s<br>
        ☁️ Condição: ${descricao}
      `;

    } catch (error) {
      weatherMain.textContent = "❌";
      weatherPanel.innerHTML = "Cidade não encontrada.";
    }
  }

  // Buscar clima ao apertar ENTER
  cidadeInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      buscarClima(cidadeInput.value.trim());
    }
  });


  /* =========================
     VIA CEP
  ========================= */

  const cepInput = document.getElementById("cep");

  cepInput.addEventListener("blur", async function () {

    const cep = cepInput.value.replace(/\D/g, "");

    if (cep.length !== 8) return;

    try {

      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado.");
        return;
      }

      document.getElementById("rua").value = data.logradouro;
      document.getElementById("bairro").value = data.bairro;
      document.getElementById("cidade").value = data.localidade;
      document.getElementById("estado").value = data.uf;

    } catch (error) {
      alert("Erro ao buscar CEP.");
    }

  });


  /* =========================
     FORMULÁRIO
  ========================= */

  const form = document.getElementById("formContato");
  const formMsg = document.getElementById("formMsg");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    formMsg.textContent = "Consulta enviada com sucesso!";
    formMsg.style.color = "green";

    form.reset();
  }); 

});