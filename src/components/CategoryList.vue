<template>
  <section class="mt-20 md:mt-30 mb-20 md:mb-40 bg-color-thirty" role="region" aria-label="Category or Platform List">
    <div class="max-w-6xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
      <!-- Recorre las categorías o plataformas únicas -->
      <div v-for="(group, index) in randomGroups" :key="index">
        <h2 class="text-xl md:text-3xl font-semibold text-color-first mb-4">
          {{ isCategory ? "Category" : "Platform" }}: {{ group.name }}
        </h2>
        <div
          v-for="game in group.games"
          :key="game.id"
          class="bg-white shadow-md rounded-lg flex flex-col md:flex-row overflow-hidden mb-4" role="article">
          <!-- Enlace al juego -->
          <a
            :href="`/game?id=${game.id}`"
            class="w-full md:w-2/4 bg-color-secondary flex items-center justify-center p-4" aria-label="Link to {{ game.title }}">
            <img
              :src="game.thumbnail"
              :alt="game.title"
              class="w-full object-cover rounded-md  border-2 custom-shadow"
            >
          </a>
          <!-- Detalles del juego -->
          <div class="w-full md:w-3/4 p-6 bg-color-secondary">
            <h3 class="text-xl md:text-2xl mb-4 font-bold text-color-first">
              {{ game.title }}
            </h3>
            <ul class="text-color-first text-sm md:text-base mb-4">
              <li><strong>Creator:</strong> {{ game.developer || "Unknown" }}</li>
              <li><strong>Platform:</strong> {{ game.platform || "N/A" }}</li>
              <li><strong>Start year:</strong> {{ game.release_date || "N/A" }}</li>
            </ul>
            <p class="text-color-first text-sm md:text-base">
              {{ game.short_description || "No description available." }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useApiStore } from "../stores/apiStore";
import { mapStores } from "pinia";

export default {
  name: "CategoryList",
  props: {
    isCategory: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      randomGroups: [], // Almacenará las categorías o plataformas aleatorias
    };
  },
  computed: {
    ...mapStores(useApiStore), // Mapea directamente el store
  },
  methods: {
    getRandomGroups() {
      if (!this.apiStore.games.length) return [];

      // Agrupar juegos por categoría o plataforma
      const groupKey = this.isCategory ? "genre" : "platform";
      const groups = this.apiStore.games.reduce((acc, game) => {
        if (!acc[game[groupKey]]) {
          acc[game[groupKey]] = [];
        }
        acc[game[groupKey]].push(game);
        return acc;
      }, {});

      // Transformar a un array de objetos con nombre y juegos
      const groupArray = Object.entries(groups).map(([name, games]) => ({
        name,
        games: games.slice(0, 3), // Limitar a 3 juegos por grupo
      }));

      // Mezclar aleatoriamente y tomar 3 grupos
      this.randomGroups = this.shuffleArray(groupArray).slice(0, 3);
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
  },
  async mounted() {
    if (!this.apiStore.games.length) {
      try {
        await this.apiStore.fetchGames("games");
      } catch (error) {
        console.error("Error al obtener los juegos:", error);
      }
    }
    this.getRandomGroups();
  },
  watch: {
    // Actualizar grupos aleatorios si cambia el tipo (categoría o plataforma)
    isCategory() {
      this.getRandomGroups();
    },
  },
};
</script>

<style scoped>
/* Estilos personalizados */
</style>
