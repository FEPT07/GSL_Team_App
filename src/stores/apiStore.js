import { defineStore } from "pinia";

export const useApiStore = defineStore("apiStore", {
  state: () => ({
    games: [], // Almacenamos todos los juegos aquí
    orderby: [], // Almacenamos los juegos procesados (ordenados/limitados)
    gameById: null, // Almacenamos la informacion del juego
  }),

  getters: {
    // Getter para obtener plataformas únicas
    platforms(state) {
      return [...new Set(state.games.map((game) => game.platform))];
    },
    // Getter para obtener categorías únicas
    categories(state) {
      return [...new Set(state.games.map((game) => game.genre))];
    },
  },

  actions: {
    // Acción para obtener los datos desde la API
    fetchGames(endpoint) {
      console.warn(endpoint);
      return fetch(
        `https://free-to-play-games-database.p.rapidapi.com/api/${endpoint}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": "bdc2242cafmsh4c0302abdc3a647p1a6d33jsn5b561224ba73",
            "X-RapidAPI-Host": "free-to-play-games-database.p.rapidapi.com",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (endpoint.includes("game?id")) {
            this.gameById = data;
          } else {
            this.games = data; // Asignamos los datos de los juegos al estado
            this.orderby = [...data]; // Inicializamos `orderby` con los mismos datos
          }
        })
        .catch((error) => {
          console.error("Error fetching games data:", error);
        });
    },

    // Acción para ordenar los juegos
    sortGames(orderType) {
      switch (orderType) {
        case "relevance":
          this.orderby = [...this.games].sort((a, b) => b.relevance - a.relevance);
          break;
        case "release-date":
          this.orderby = [...this.games].sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
          break;
        case "alphabetical":
          this.orderby = [...this.games].sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
      }
    },

    // Acción para limitar los resultados
    limitResults(limit) {
      this.orderby = this.orderby.slice(0, limit);
    },
    fetchGameById(id) {
      this.gameById = this.games.find((game) => game.id === id);//nuevo
    },
  },
});
