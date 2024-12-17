<template>
  <div class="slider-container">
    <div v-if="loading" class="loading-spinner">
      <p>Cargando carrusel...</p>
    </div>
    <div v-else-if="gameDetails.length && gamesOrdered.length" class="slider">
      <div class="list">
        <div
          v-for="(item, index) in gameDetails"
          :key="index"
          class="item"
          :class="{ active: index === currentIndex }"
          v-show="index === currentIndex"
        >
          <img
            :src="item.screenshots[0]?.image || item.thumbnail || 'default-thumbnail.jpg'"
            :alt="item.alt || 'Imagen no disponible'"
          />
          <div class="content">
            <div class="font-bold drop-shadow-lg neonText6 mb-2">
              <span>{{ platform || category }}</span>
            </div>
            <div class="title">{{ item.title || 'Título no disponible' }}</div>
            <div class="description">{{ item.short_description || 'Descripción no disponible' }}</div>
            <div class="button">
              <button @click="navigateToGame(item.id)">More Info</button>
            </div>
          </div>
        </div>
      </div>
      <div class="thumbnail">
        <div
          v-for="(item, index) in gamesOrdered"
          :key="'thumb-' + index"
          class="item"
          :class="{ active: index === 0 }"
          @click="goToSlide(index)"
        >
          <img :src="item.thumbnail || 'default-thumbnail.jpg'" :alt="item.alt || 'Thumbnail'" />
        </div>
      </div>
      <div class="nextPrevArrows">
        <button class="prev" @click="prevSlide()"></button>
        <button class="next" @click="nextSlide()"></button>
      </div>
    </div>
    <div v-else>
      <p>No se encontraron juegos para mostrar.</p>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useApiStore } from "../stores/apiStore";

export default {
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
      limit: 12,
      currentIndex: 0,
      gameDetails: [],
      gamesOrdered: [],
      autoSlideInterval: null,
      loading: true,
    };
  },
  computed: {
    ...mapStores(useApiStore),
    
  },
  watch: {
    platform: "fetchAndResetGames",
    category: "fetchAndResetGames",
  },
  methods: {
    async fetchAndResetGames() {
      this.currentIndex = 0;
      this.loading = true;
      await this.fetchGames();
      this.loading = false;
    },
    async fetchGames() {
      try {
        const games = this.apiStore.games.length
          ? this.apiStore.games
          : await this.apiStore.fetchGames("games");

        let filteredGames = [...games];

        if (this.platform) {
          filteredGames = filteredGames.filter((game) =>
            game.platform?.toLowerCase().includes(this.platform.toLowerCase())
          );
        }

        if (this.category) {
          filteredGames = filteredGames.filter((game) =>
            game.genre?.toLowerCase().includes(this.category.toLowerCase())
          );
        }

        this.gamesOrdered = filteredGames
          .sort(() => Math.random() - 0.5)
          .slice(0, this.limit);

        const idsArray = this.gamesOrdered.map((game) => game.id);

        this.gameDetails = await Promise.all(
          idsArray.map((id) =>
            this.apiStore
              .fetchCarruselImages(`game?id=${id}`)
              .catch(() => ({
                screenshots: [],
                thumbnail: "default-thumbnail.jpg",
                alt: "Sin descripción",
                title: "Juego no disponible",
                short_description: "Descripción no disponible",
              }))
          )
        );

        if (!this.gameDetails.length) {
          console.warn("No se cargaron detalles del juego");
        }
      } catch (error) {
        console.error("Error al cargar los juegos:", error);
        this.gamesOrdered = [];
        this.gameDetails = [];
      } finally {
        this.loading = false;
      }
    },
    navigateToGame(id) {
      this.$router.push(`/game?id=${id}`);
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.gamesOrdered.length;
      this.gamesOrdered.push(this.gamesOrdered.shift());
    },
    prevSlide() {
      this.currentIndex =
        (this.currentIndex - 1 + this.gamesOrdered.length) %
        this.gamesOrdered.length;
        this.gamesOrdered.unshift(this.gamesOrdered.pop());
    },
    restartAnimations() {
      this.stopAutoSlide();
      this.startAutoSlide();
    },
    startAutoSlide() {
      if (this.gamesOrdered.length > 0) {
        this.autoSlideInterval = setInterval(this.nextSlide, 10000);
      }
    },
    stopAutoSlide() {
      clearInterval(this.autoSlideInterval);
    },
  },
  async mounted() {
    await this.fetchGames();
    if (this.gamesOrdered.length) {
      this.autoSlideInterval = setInterval(this.nextSlide, 10000);
      this.startAutoSlide();
    }
  },
  beforeUnmount() {
    clearInterval(this.autoSlideInterval);
  },
};
</script>

<!-- <template>
  <div class="slider" role="region" aria-label="Game Carousel">
    <div class="list">
      <div v-for="(item, index) in gameDetails" :key="index" class="item" :class="{ active: index === currentIndex }"
        v-show="index === currentIndex" role="tabpanel" :aria-hidden="index !== currentIndex"
        :aria-labelledby="'thumb-' + index">
        <img :src="item.screenshots[0]?.image || item.thumbnail" :alt="item.alt || 'Game image'" />
        <div class="content">
          <div class="font-bold drop-shadow-lg neonText6 mb-2 tracking-wider"><span>{{ platform || category }}</span></div>
          <div class="title">{{ item.title }}</div>
          <div class="description">{{ item.short_description }}</div>
          <div class="button">
            <button @click="navigateToGame(item.id)">More Info</button>
          </div>
        </div>
      </div>
    </div>
    <div class="thumbnail" role="tablist">
      <div v-for="(item, index) in gamesOrdered" :key="'thumb-' + index" class="item" :class="{ active: index === 0 }"
        @click="goToSlide(index)" role="tab" :aria-selected="index === currentIndex"
        :aria-controls="'tabpanel-' + index" tabindex="0">
        <img :src="item.thumbnail" :alt="item.alt || 'Thumbnail of ' + item.title" />
      </div>
    </div>
    <div class="nextPrevArrows">
      <button class="prev" @click="prevSlide()" aria-label="Previous slide"></button>
      <button class="next" @click="nextSlide()" aria-label="Next slide"></button>
    </div>
  </div>
</template> -->

<!-- <script>
import { mapStores } from "pinia";
import { useApiStore } from "../stores/apiStore";

export default {
  props: {
    platform: { type: String, default: null },
    category: { type: String, default: null },
  },
  data() {
    return {
      limit: 12,
      currentIndex: 0,
      gameDetails: [],
      gamesOrdered: [],
      autoSlideInterval: null,
    };
  },
  computed: {
    ...mapStores(useApiStore),
  },
  watch: {
    platform: "fetchAndResetGames",
    category: "fetchAndResetGames",
  },
  methods: {
    async fetchAndResetGames() {
      this.currentIndex = 0;
      await this.fetchGames();
      this.restartAnimations();
    },
    async fetchGames() {
      try {
        const games = this.apiStore.games.length
          ? this.apiStore.games
          : await this.apiStore.fetchGames("games");

        let filteredGames = [...games];
        if (this.platform) {
          filteredGames = filteredGames.filter((game) =>
            game.platform?.toLowerCase().includes(this.platform.toLowerCase())
          );
        }
        if (this.category) {
          filteredGames = filteredGames.filter((game) =>
            game.genre?.toLowerCase().includes(this.category.toLowerCase())
          );
        }

        this.gamesOrdered = filteredGames
          .sort(() => Math.random() - 0.5)
          .slice(0, this.limit);

        const idsArray = this.gamesOrdered.map((game) => game.id);
        this.gameDetails = await Promise.all(
          idsArray.map((id) =>
            this.apiStore.fetchCarruselImages(`game?id=${id}`)
          )
        );
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    },
    navigateToGame(id) {
      if (id) this.$router.push({ path: "/game", query: { id } });
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.gamesOrdered.length;
      this.gamesOrdered.push(this.gamesOrdered.shift());
    },
    prevSlide() {
      this.currentIndex =
        (this.currentIndex - 1 + this.gamesOrdered.length) %
        this.gamesOrdered.length;
        this.gamesOrdered.unshift(this.gamesOrdered.pop());
    },
    restartAnimations() {
      this.stopAutoSlide();
      this.startAutoSlide();
    },
    startAutoSlide() {
      if (this.gamesOrdered.length > 0) {
        this.autoSlideInterval = setInterval(this.nextSlide, 10000);
      }
    },
    stopAutoSlide() {
      clearInterval(this.autoSlideInterval);
    },
  },
  async mounted() {
    await this.fetchGames();
    this.startAutoSlide();
  },
  beforeUnmount() {
    this.stopAutoSlide();
  },
};
/* export default {
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
      limit: 12, // Límite de resultados
      currentIndex: 0,
      gameDetails: [],
      gamesOrdered: [],
      autoSlideInterval: null,
    };
  },
  computed: {
    ...mapStores(useApiStore),
  },
  watch: {
    platform: "fetchAndResetGames",
    category: "fetchAndResetGames",
  },
  methods: {
    async fetchAndResetGames() {
      this.currentIndex = 0; // Reiniciar el índice del carrusel
      await this.fetchGames(); // Volver a cargar los juegos
      this.restartAnimations(); // Reiniciar las animaciones
    },
    async fetchGames() {
      const games = this.apiStore.games;

      if (!games.length) {
        await this.apiStore.fetchGames("games");
      }

      let filteredGames = [...games];

      if (this.platform) {
        filteredGames = filteredGames.filter((game) =>
          game.platform.toLowerCase().includes(this.platform.toLowerCase())
        );
      }

      if (this.category) {
        filteredGames = filteredGames.filter((game) =>
          game.genre.toLowerCase().includes(this.category.toLowerCase())
        );
      }

      this.gamesOrdered = filteredGames
        .sort(() => Math.random() - 0.5)
        .slice(0, this.limit);

      const idsArray = this.gamesOrdered.map((game) => game.id);
      this.gameDetails = await Promise.all(
        idsArray.map((id) =>
          this.apiStore.fetchCarruselImages(`game?id=${id}`)
        )
      );
    },
    navigateToGame(id) {
      this.$router.push(`/game?id=${id}`);
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.gamesOrdered.length;
      this.gamesOrdered.push(this.gamesOrdered.shift());
    },
    prevSlide() {
      this.currentIndex =
        (this.currentIndex - 1 + this.gamesOrdered.length) %
        this.gamesOrdered.length;
      this.gamesOrdered.unshift(this.gamesOrdered.pop());
    },
    restartAnimations() {
      this.stopAutoSlide();
      this.startAutoSlide();
    },
    startAutoSlide() {
      this.autoSlideInterval = setInterval(this.nextSlide, 10000);
    },
    stopAutoSlide() {
      clearInterval(this.autoSlideInterval);
    },
  },
  mounted() {
    this.fetchGames(); // Cargar los juegos al montar el componente
    this.startAutoSlide(); // Iniciar las animaciones
  },
  beforeUnmount() {
    this.stopAutoSlide(); // Detener las animaciones al desmontar
  },
}; */
</script>
 -->
<style>
/* seccion imagenes grandes */
.slider {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;

  & .list {
    position: relative;
    width: 100%;
    height: 100%;

    & .item {
      position: absolute;
      inset: 0;
      transition: 0.7s;

      & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      & .content {
        position: absolute;
        top: 20%;
        width: 1140px;
        height: 40%;
        max-width: 70%;
        left: 56%;
        transform: translateX(-75%);
        padding-right: 30%;
        box-sizing: border-box;
        color: #fff;

        & .title {

          font-size: 4em;
          letter-spacing: 4px;
          font-weight: bold;
          line-height: 1.3em;
          padding-bottom: 10px;
          text-shadow: 0 0 7px #ff6600, 0 0 10px #ff6600, 0 0 21px #ff6600,
            0 0 42px #5271ff, 0 0 82px #5271ff, 0 0 92px #5271ff,
            0 0 102px #5271ff, 0 0 151px #5271ff;
        }

        & .description {
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 1px;
          background-color: rgba(63, 106, 138, 0.71);
          padding: 10px;
          border-radius: 15px;
        }

        & .button {
          margin-top: 20px;

          & button {
            border-radius: 5px;
            border: none;
            font-size: 12px;
            padding: 7px 7px;
            font-weight: 800;
            cursor: pointer;
            letter-spacing: 1px;
            transition: 0.4s;
            color: #2c771c;
            background-color: #fff;
            box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #0fa,
              0 0 0.8rem #0fa, 0 0 2.8rem #0fa, inset 0 0 1.3rem #0fa;

            &:hover {
              background-color: #33a21d;
              color: #fff;
              font-weight: 800;
            }
          }
        }
      }
    }
  }
}

.thumbnail {
  display: flex;
  gap: 20px;
  position: absolute;
  bottom: 87px;
  left: 40%;
  width: max-content;
  z-index: 5;

  & .item {
    width: 290px;
    height: 170px;
    flex-shrink: 0;
    position: relative;
    border-radius: 10px;
    cursor: pointer;
    filter: brightness(0.5);
    transition: transform 0.3s, filter 0.3s;

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 0 4rem rgb(132, 113, 92), 0 0 3rem #ff6600,
        inset 0 0 2.3rem rgb(92, 101, 98);
    }

  }

  & .item.active {
    transform: scale(1.1);
    filter: brightness(1.5);
    box-shadow: 0 0 .3rem #fff,
      0 0 .1rem #fff,
      0 0 1rem #e51a4c,
      0 0 0.9rem #e51a4c,
      0 0 2rem #ff7214,
      inset 0 0 0.8rem #ff7214;
  }
}

.nextPrevArrows {
  position: absolute;
  top: 74%;
  right: 54%;
  z-index: 100;
  width: 300px;
  max-width: 30%;
  display: flex;
  gap: 10px;
  align-items: center;

  & button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0 0 0.3rem #fff, 0 0 0.3rem #fff, 0 0 2.5rem #bc13fe,
      0 0 1rem #bc13fe, 0 0 3rem #bc13fe, inset 0 0 1.5rem #bc13fe;
    border: none;
    background-color: #bc13fe;
    color: #ff00ff;
    font-family: monospace;
    font-size: 22px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.4s ease;

    &:hover {
      background: var(--Gradiente-Radial,
          radial-gradient(270.17% 139.44% at 99.27% 1%,
            #483c9e 0%,
            #68088b 31.27%,
            #6c2c4a 65.27%,
            #000 99.77%));
      color: #fff;
    }
  }

  .prev::after {
    content: "<";
  }

  .next::after {
    content: ">";
  }
}

@keyframes showContent {
  to {
    transform: translateY(0px);
    filter: blur(0px);
    opacity: 1;
  }
}

.slider {
  & .list {
    & .item {
      & .content {

        & .title,
        & .description,
        & .button {
          transform: translateY(50px);
          filter: blur(20px);
          opacity: 0;
          animation: showContent 0.5s linear forwards;
        }

        & .title {
          animation-delay: 0.4s;
        }

        & .description {
          animation-delay: 0.6s;
        }

        & .button {
          animation-delay: 0.8s;
        }
      }
    }
  }
}

@media screen and (max-width: 678px) {
  .slider {
    & .list {
      & .item {
        & .content {
          padding-right: 0;

          & .title {
            font-size: 40px;
          }
        }
      }
    }
  }
}
</style>
