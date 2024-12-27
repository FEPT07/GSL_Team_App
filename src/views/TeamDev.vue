<template>
  <div class="bg-color-thirty" role="region" aria-labelledby="team-dev-heading">
    <div v-if="loading">
      <Spinner />
    </div>
    <div v-else>
      <Navbar />
      <!-- Sección principal -->
      <section class="min-h-screen bg-gradient text-color-first">
        <section class="flex flex-col items-center gap-6 md:gap-8 pt-20 md:pt-24 px-4 sm:px-6 md:px-8">
          <h1 id="team-dev-heading" class="neonText2 tracking-wider text-5xl md:text-6xl font-bold text-center">Team Dev</h1>
          <p class="text-lg md:text-2xl text-center">
            Esta plataforma es el resultado del trabajo colaborativo de nuestro
            equipo de desarrollo.
          </p>
        </section>

        <!-- Sección de perfiles -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-8 py-6 mt-4" aria-labelledby="profile-section-heading">
          <h2 id="profile-section-heading" class="sr-only">Perfiles de Desarrolladores</h2>
          <!-- Perfil Gerard -->
          <div class="flex flex-col items-center text-center p-6 rounded-lg shadow-lg border-2 custom-shadow" role="article" aria-labelledby="gerard-profile-heading">
            <img class="w-[120px] md:w-[140px] rounded-full mb-6 shadow-lg object-cover" src="../../public/photos/gerardmacias.jpg" alt="Foto de Gerard Macias" />
            <h3 id="gerard-profile-heading" class="text-xl md:text-3xl font-bold mb-2">Gerard Macias</h3>
            <p class="text-md md:text-lg">
              Desarrollador Full Stack con experiencia en diversas tecnologías y enfoque en la mejora continua.
            </p>
            <div class="flex items-center gap-4 mt-2">
              <a href="https://github.com/jerardmacias" target="_blank">
                <img class="w-10 md:w-12" src="../assets/github-icon.svg" alt="Repositorio en GitHub de Gerard" />
              </a>
              <a href="https://www.linkedin.com/in/gerardomacias74/" target="_blank">
                <img class="w-8 md:w-10" src="../assets/linkedin-icon.svg" alt="Perfil de LinkedIn de Gerard" />
              </a>
            </div>
          </div>

          <!-- Perfil Sébastien -->
          <div class="flex flex-col items-center text-center p-6 rounded-lg shadow-lg border-2 custom-shadow" role="article" aria-labelledby="sebastien-profile-heading">
            <img class="w-[120px] md:w-[140px] rounded-full mb-6 shadow-lg object-cover"
              src="../../public/photos/sebastienleger.jpg" alt="Foto de Sébastien Léger" />
            <h3 id="sebastien-profile-heading" class="text-xl md:text-3xl font-bold mb-2">Sébastien Léger</h3>
            <p class="text-md md:text-lg">
              Desarrollador front-end apasionado por la tecnología y el diseño, con el objetivo de alcanzar la maestría en el área.
            </p>
            <div class="flex items-center gap-4 mt-2">
              <a href="https://github.com/SebastienLeger02" target="_blank">
                <img class="w-10 md:w-12" src="../assets/github-icon.svg" alt="Repositorio en GitHub de Sébastien" />
              </a>
              <a href="https://www.linkedin.com/in/sebastien-dev/" target="_blank">
                <img class="w-8 md:w-10" src="../assets/linkedin-icon.svg" alt="Perfil de LinkedIn de Sébastien" />
              </a>
            </div>
          </div>

          <!-- Perfil Lenin -->
          <div class="flex flex-col items-center text-center p-6 rounded-lg shadow-lg border-2 custom-shadow" role="article" aria-labelledby="lenin-profile-heading">
            <img class="w-[120px] md:w-[140px] rounded-full mb-6 shadow-lg object-cover"
              src="../../public/photos/leninruiz.jpg" alt="Foto de Lenin Ruiz" />
            <h3 id="lenin-profile-heading" class="text-xl md:text-3xl font-bold mb-2">Lenin Ruiz</h3>
            <p class="text-md md:text-lg">
              Desarrollador Full Stack y front-end con ganas de seguir
              evolucionando dentro del campo de la tecnología.
            </p>
            <div class="flex items-center gap-4 mt-2">
              <a href="https://github.com/lenrprueba/" target="_blank">
                <img class="w-10 md:w-12" src="../assets/github-icon.svg" alt="Repositorio en GitHub de Lenin" />
              </a>
              <a href="https://www.linkedin.com/in/lenin-ruiz-b7a317131/" target="_blank">
                <img class="w-8 md:w-10" src="../assets/linkedin-icon.svg" alt="Perfil de LinkedIn de Lenin" />
              </a>
            </div>
          </div>
        </section>
      </section>
      <FooterSection />
    </div>
  </div>
</template>

<script>

import Navbar from "../components/Navbar.vue";
import Spinner from "../components/Spinner.vue";
import FooterSection from "../components/FooterSection.vue";

export default {
  name: "TeamDev",
  data() {
    return {
      loading: true,
    };
  },
  components: {
    Spinner,
    Navbar,
    FooterSection,
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 500);
  },
};
</script>

<style></style>
