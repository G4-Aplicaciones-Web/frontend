<script>
import FooterContent from "./public/components/footer-content.component.vue";
import AuthenticationSection from "@/domains/iam/components/authentication-section.component.vue";

export default {
  name: 'App',
  components: { AuthenticationSection, FooterContent },
  data() {
    return {
      drawer: false,
      items: [
        { label: 'option.home', to: '/home', icon: 'pi pi-home' },
        { label: 'option.recommendations', to: '/recommendations', icon: 'pi pi-star' },
        { label: 'option.meal_plans', to: '/meal_plans/1', icon: 'pi pi-calendar' },
        { label: 'option.recipes', to: '/recipes', icon: 'pi pi-book' },
        { label: 'option.about', to: '/about', icon: 'pi pi-info-circle' },
        { label: 'option.profile', to: '/profile', icon: 'pi pi-user' },
      ]
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer
    }
  }
}
</script>

<template>
  <pv-toast />
  <pv-confirm-dialog />

  <div class="layout-wrapper">
    <header class="layout-header">
      <pv-toolbar class="app-toolbar">
        <template #start>
          <pv-button class="menu-button p-button-rounded" icon="pi pi-bars" @click="toggleDrawer" />
          <img src="/main-logo.png" alt="Logo" class="app-logo" />
        </template>

        <!-- Menú de navegación para pantallas grandes -->
        <template #center>
          <div class="navigation-menu">
            <pv-button v-for="item in items"
                       :key="item.label"
                       class="nav-button p-mx-2"
                       as-child
                       v-slot="slotProps">
              <router-link :to="item.to" :class="['nav-link', slotProps['class']]">
                <i :class="[item.icon, 'nav-icon']"></i>
                <span class="nav-text">{{ $t(item.label) }}</span>
              </router-link>
            </pv-button>
          </div>
        </template>
      </pv-toolbar>

      <!-- Drawer para navegación en dispositivos móviles -->
      <pv-drawer v-model:visible="drawer" position="left" class="mobile-menu">
        <div class="drawer-header">
          <img src="/main-logo.png" alt="Logo" class="app-logo" />
        </div>
        <div class="drawer-content">
          <div class="menu-items">
            <router-link
                v-for="item in items"
                :key="item.label"
                :to="item.to"
                class="menu-item"
                @click="drawer = false">
              <i :class="[item.icon, 'menu-icon']"></i>
              <span class="menu-text">{{ $t(item.label) }}</span>
            </router-link>
          </div>
        </div>
      </pv-drawer>
    </header>

    <main class="layout-main">
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>

    <footer class="layout-footer">
      <footer-content />
    </footer>
  </div>
</template>

<style scoped>
/* Estructura principal */
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.layout-header {
  flex: 0 0 auto;
  position: sticky;
  top: 0;
  z-index: 999;
}

.app-logo {
  height: 96px; /* o el tamaño que se vea bien */
  object-fit: contain;
  margin-left: 1rem; /* opcional, para separación del botón */
}

/* Barra de navegación principal */
.app-toolbar {
  background-color: var(--primary-color)  !important; /* Verde para Alimentate Plus */
  color: white !important;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}


/* Botón de menú más visible */
.menu-button {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border: none !important;
  color: white !important;
  font-size: 1.2rem;
}

.menu-button:hover {
  background-color: rgba(255, 255, 255, 0.3) !important;
}

/* Menú de navegación */
.navigation-menu {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.nav-button {
  background-color: transparent !important;
  border: none !important;
  color: white !important;
  padding: 0.5rem 1rem !important;
  font-weight: 500;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.nav-icon {
  margin-right: 8px;
}

.nav-text {
  font-size: 1rem;
}

.nav-link {
  background-color: #63B663 !important;
  border-radius: 7px;
  padding: 0.5rem 1rem;
  display: inline-flex;
  align-items: center;
  color: white !important;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: var(--primary-color-hover) !important;
}

/* Contenido principal */
.layout-main {
  flex: 1 1 auto;
  position: relative;
  padding: 20px;
  background-color: var(--background-color, #ffffff);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Footer */
.layout-footer {
  flex: 0 0 auto;
  padding: 20px;
  margin-top: auto;
  border-top: 1px solid #e0e0e0;
}

/* Drawer para móvil con mejor contraste */
.mobile-menu {
  width: 280px;
  background-color: white;
}

.drawer-header {
  border-radius: 8px;
  padding-left: 17px;
}

.drawer-content {
  padding: 16px;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  text-decoration: none;
  color: #333333;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500; /* medium de Poppins */
}

.menu-item:hover {
  background-color: rgba(76, 175, 80, 0.1); /* Verde claro al hover */
  color: #4CAF50;
}

.menu-icon {
  margin-right: 12px;
  font-size: 1.2rem;
  color: #4CAF50;
}

.menu-text {
  font-size: 1rem;
}

/* Responsividad mejorada */
@media screen and (max-width: 768px) {
  .navigation-menu {
    display: none;
  }

  .menu-button {
    display: block !important;
  }

  .layout-main {
    padding: 15px;
  }
}

@media screen and (min-width: 769px) {
  .menu-button {
    display: none !important;
  }
}

/* Soporte para modo oscuro */
@media (prefers-color-scheme: dark) {
  .app-toolbar {
    background-color: #ffffff !important;
  }

  .layout-main {
    background-color: var(--background-color, #242424);
  }

  .layout-footer {
    background-color: #1e1e1e;
    border-top: 1px solid #333333;
  }

  .mobile-menu {
    background-color: #242424;
  }

  .drawer-header {
    background-color: #ffffff;
  }

  .menu-item {
    color: rgba(255, 255, 255, 0.87);
  }

  .menu-item:hover {
    background-color: rgba(76, 175, 80, 0.2);
    color: #81c784;
  }

  .menu-icon {
    color: #81c784;
  }
}
</style>
