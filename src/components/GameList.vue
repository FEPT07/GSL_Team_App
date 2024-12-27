<template>
  <div class="container mx-auto px-4 py-10 mt-20 bg-color-thirty" role="region" aria-labelledby="game-list-heading">
    <h1 id="game-list-heading" class="text-2xl font-bold mb-4 text-white">
      <span v-if="category">Más juegos de esta categoría</span>
      <span v-else-if="platform">Más juegos de esta plataforma</span>
      <span v-else>Otros juegos</span>
    </h1>
    <div v-if="randomGames.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="(game) in randomGames" :key="game.id" class="bg-gray-800 shadow-md rounded-lg p-4" role="article">
        <!-- Imagen y enlace al juego -->
        <a :href="`/game?id=${game.id}`" class="block h-52 lg:h-32 rounded-md mb-4" aria-label="Link to {{ game.title }}">
          <img :src="game.thumbnail" :alt="'Thumbnail of ' + game.title" class="w-full h-full object-cover rounded-md" />
        </a>
        <!-- Categoría del juego -->
        <p class="text-sm text-gray-200">{{ game.genre || "Unknown" }}</p>
        <!-- Título del juego -->
        <h2 class="font-semibold text-lg text-gray-100">
          <a :href="`/game?id=${game.id}`">{{ game.title }}</a>
        </h2>
        <!-- Descripción del juego -->
        <p class="text-gray-300 text-sm">
          {{ game.short_description || "No description available." }}
        </p>
      </div>
    </div>
    <p v-else class="text-gray-400 text-center">No games available.</p>
  </div>
</template>

<script>
import { useApiStore } from "../stores/apiStore";
import { mapStores } from "pinia";

export default {
  name: "GameList",
  props: {
    platform: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      randomGames: [], // Juegos aleatorios que se mostrarán
    };
  },
  computed: {
    ...mapStores(useApiStore),
  },
  watch: {
    platform: "fetchAndFilterGames",
    category: "fetchAndFilterGames",
  },
  methods: {
    /**
     * Filtra y selecciona juegos basados en platform, category o sin filtros.
     */
    async fetchAndFilterGames() {
      // Asegurarse de que los juegos están disponibles
      if (!this.apiStore.games.length) {
        await this.apiStore.fetchGames("games");
      }

      let filteredGames = [...this.apiStore.games];

      if (this.platform) {
        filteredGames = filteredGames.filter((game) =>
          game.platform.toLowerCase().includes(this.platform.toLowerCase())
        );
      } else if (this.category) {
        filteredGames = filteredGames.filter((game) =>
          game.genre.toLowerCase().includes(this.category.toLowerCase())
        );
      }

      // Mezclar juegos aleatoriamente y limitar a 8
      this.randomGames = filteredGames.sort(() => Math.random() - 0.5).slice(0, 8);
    },
  },
  async mounted() {
    await this.fetchAndFilterGames();
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
