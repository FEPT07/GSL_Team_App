<template>
  <section :class="[
    'fixed w-full z-50 px-4 py-2 transition-all duration-300',
    isScrolled ? 'bg-color-secondary/40 backdrop-blur-md' : 'bg-color-secondary border-b-2 custom-shadow',
  ]" role="navigation" aria-label="Main Navigation">
    <div class="flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" aria-label="Go to homepage">
        <img class="w-28 h-9" src="../assets/logo_gsl.png" alt="GSL Game App Logo" />
      </router-link>

      <!-- Desktop Menu -->
      <nav class="hidden lg:flex space-x-6 items-center text-slate-200" aria-label="Desktop Navigation">
        <!-- Dropdown Plataforma -->
        <div class="relative group">
          <button class="flex items-center" @mouseover="showPlatform = true" @mouseleave="showPlatform = false">
            Plataforma
            <svg class="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-show="showPlatform"
            class="absolute w-[300px] shadow-lg rounded z-50 grid grid-cols-1 gap-2 cursor-pointer py-4 bg-color-thirty/70"
            @mouseover="showPlatform = true" @mouseleave="showPlatform = false" role="menu" aria-label="Platform Menu">
            <router-link v-for="platform in apiStore.platforms" :key="platform"
              :to="`/platform/${formatToUrl(platform)}`" class="whitespace-nowrap hover:bg-gray-500 p-1" role="menuitem"
              @click="closeMenus">
              {{ platform }}
            </router-link>
          </div>
        </div>

        <!-- Dropdown Categorías -->
        <div class="relative group">
          <button class="flex items-center" @mouseover="showCategory = true" @mouseleave="showCategory = false">
            Categorías
            <svg class="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-show="showCategory"
            class="absolute w-[600px] shadow-lg rounded z-50 grid grid-cols-3 gap-2 cursor-pointer py-4 bg-color-thirty/70"
            @mouseover="showCategory = true" @mouseleave="showCategory = false" role="menu" aria-label="Category Menu">
            <router-link v-for="category in apiStore.categories" :key="category"
              :to="`/category/${formatToUrl(category)}`" class="whitespace-nowrap hover:bg-gray-500 p-1" role="menuitem"
              @click="closeMenus">
              {{ category }}
            </router-link>
          </div>
        </div>

        <router-link to="/team-dev" role="menuitem" @click="closeMenus">Team Dev</router-link>
      </nav>

      <!-- Search & GitHub -->
      <div class="hidden lg:flex space-x-6 items-center">
        <div class="relative">
          <input type="search" autocomplete="off" v-model="searchQuery" @input="onSearch"
            @keyup.enter="navigateToFirstSuggestion" placeholder="Find a game" id="search"
            class="w-58 h-8 p-5 border-2 border-gray-400 text-slate-200 text-base rounded-full bg-gray-600/80 placeholder:text-slate-300"
            aria-label="Search games" />
          <div class="absolute top-1 right-1" @click="navigateToFirstSuggestion">
            <img class="w-9 h-9 sepia" src="../assets/search-icon.svg" alt="Search Icon" />
          </div>
          <ul v-if="suggestions.length" class="absolute shadow-lg rounded-mg w-full p-2 z-10 bg-color-thirty/70"
            role="listbox" aria-labelledby="search">
            <li v-for="(name, index) in suggestions" :key="index" @click="navigateToGame(name)"
              class="hover:bg-gray-500 px-4 py-2 text-gray-200 cursor-pointer" role="option"
              :aria-selected="index === 0">
              {{ name }}
            </li>
          </ul>
        </div>
        <a href="https://github.com/FEPT07/GSL_Team_App" target="_blank" rel="noopener noreferrer"
          class="text-white-700 hover:opacity-90 flex items-center space-x-2" aria-label="Go to GitHub repository">
          <img src="../assets/github-icon.svg" alt="GitHub Icon" class="text-white-700 w-8 h-8" />
          <span>GitHub</span>
        </a>
      </div>

      <!-- Mobile Hamburger Menu -->
      <div class="order-first lg:hidden flex items-center">
        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-slate-200" aria-label="Toggle mobile menu">
          <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <nav v-if="isMobileMenuOpen" class="lg:hidden bg-color-secondary py-4 space-y-4 text-slate-200"
      aria-label="Mobile Navigation">
      <router-link to="/" class="block px-4" @click="closeMenus">Home</router-link>
      <div>
        <button @click="mobilePlatformOpen = !mobilePlatformOpen" class="flex items-center w-full px-4">
          Plataforma
          <svg class="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-if="mobilePlatformOpen" class="pl-6 space-y-2">
          <router-link v-for="platform in apiStore.platforms" :key="platform" :to="`/platform/${formatToUrl(platform)}`"
            class="block whitespace-nowrap hover:bg-gray-500 p-1" @click="closeMenus">
            {{ platform }}
          </router-link>
        </div>
      </div>
      <div>
        <button @click="mobileCategoryOpen = !mobileCategoryOpen" class="flex items-center w-full px-4">
          Categorías
          <svg class="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-if="mobileCategoryOpen" class="pl-6 space-y-2">
          <router-link v-for="category in apiStore.categories" :key="category"
            :to="`/category/${formatToUrl(category)}`" class="block whitespace-nowrap hover:bg-gray-500 p-1"
            @click="closeMenus">
            {{ category }}
          </router-link>
        </div>
      </div>
      <router-link to="/team-dev" class="block px-4" @click="closeMenus">Team Dev</router-link>
    </nav>
  </section>
</template>

<script>
import { useApiStore } from "../stores/apiStore";
import { mapStores } from "pinia";

export default {
  data() {
    return {
      showPlatform: false,
      showCategory: false,
      searchQuery: "",
      suggestions: [],
      isMobileMenuOpen: false,
      mobilePlatformOpen: false,
      mobileCategoryOpen: false,
      isScrolled: false,
    };
  },
  computed: {
    ...mapStores(useApiStore),
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 0;
    },
    onSearch() {
      if (!this.searchQuery.trim()) {
        this.suggestions = [];
        return;
      }
      this.suggestions = this.apiStore.games
        .map((game) => game.title)
        .filter((name) => name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
    navigateToGame(name) {
      const selectedGame = this.apiStore.games.find((game) => game.title === name);
      if (selectedGame) {
        this.$router.push(`/game?id=${selectedGame.id}`);
      }
      this.searchQuery = "";
      this.suggestions = [];
    },
    navigateToFirstSuggestion() {
      if (this.suggestions.length > 0) {
        this.navigateToGame(this.suggestions[0]);
      }
    },
    formatToUrl(text) {
      return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    },
    closeMenus() {
      this.showPlatform = false;
      this.showCategory = false;
      this.isMobileMenuOpen = false;
      this.mobilePlatformOpen = false;
      this.mobileCategoryOpen = false;
    },
  },
};
</script>

<style scoped>
section {
  color: #fff;
  font-weight: 600;
  transition: background-color 0.3s, backdrop-filter 0.3s;
}
</style>
