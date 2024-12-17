# GSL Game App

## 1. Introducción
### Bienvenida y Contexto
Bienvenidos a la presentación de GSL Game App, una aplicación interactiva de búsqueda y exploración de videojuegos.  
Desarrollada con Vue.js, estilizada con Tailwind CSS y gestionada con un backend integrado mediante Pinia para manejar la API freetogame.  
La aplicación brinda una experiencia envolvente para los usuarios interesados en explorar videojuegos con detalles completos.

 **Imagen de Referencia:**
  
  ![Estructura del Proyecto](src\assets\project-structure.png)

## 2. Descripción General del Proyecto
### Tecnologías y Herramientas Utilizadas
- **Frontend:** Vue.js + Pinia, Tailwind CSS, JavaScript.
- **Backend:** Integración con la API freetogame.
- **Herramientas de Desarrollo:**
  - **Diseño:** Figma.
  - **Gestión y Documentación:** Notion y Trello.
  - **Control de Versiones:** Git & GitHub.
  - **Editor:** VS Code.

## 3. Arquitectura del Proyecto
La estructura del proyecto está diseñada para ser escalable y eficiente.
### Estructura de Archivos
- **src/:** Carpeta principal del código fuente.
  - **assets/:** Recursos estáticos.
  - **components/:** Componentes reutilizables de Vue.js.
  - **stores/:** Gestión de estado usando Pinia.
  - **views/:** Vistas principales de la aplicación.
  - **App.vue:** Componente raíz.
  - **main.js:** Archivo principal de entrada.
  - **routes.js:** Configuración de rutas.

## 4. Funcionalidades Principales
### Exploración de Videojuegos
- **Carrusel Interactivo:** Permite navegar entre videojuegos destacados.
- **Listado de Juegos:** Los usuarios pueden explorar juegos y aplicar filtros por categoría y plataforma.

### Información Detallada
- **Descripciones:** Información completa sobre trama, personajes y mecánicas.
- **Especificaciones Técnicas:** Requisitos del sistema, resolución y tamaño.
- **Características Clave:** Información sobre gráficos, sonido y modos de juego.

## 5. Desarrollo de la Aplicación
- **Arquitectura:** Construida con un enfoque MVP (Minimum Viable Product).
- **API:** Integración directa con freetogame API a través de Pinia Store, eliminando la necesidad de mocks.
  - La inyección de dependencias permite que los componentes consuman los datos de forma eficiente.
- **Diseño:** Implementado con Figma siguiendo una guía de estilos coherente.

## 6. Demostración en Vivo
Visita la aplicación en el siguiente enlace:  
👉 [GSL Game App en Vercel](https://gsl-team-p883dxju8-gerards-projects-f6fb116e.vercel.app/)

### Características Clave:
1. **Interfaz Responsive:** Construida con Tailwind CSS.
2. **Carrusel de Juegos:** Navegación intuitiva.
3. **Filtros Dinámicos:** Clasificación por categorías y plataformas.
4. **Detalles del Juego:** Visualización clara y estructurada de la información.

## 7. Conclusión
GSL Game App es una herramienta intuitiva y eficiente para los amantes de los videojuegos.  
Gracias a tecnologías como Vue.js, Tailwind CSS y el manejo de estado con Pinia, logramos un producto funcional y escalable.
