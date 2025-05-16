<script>
import LanguageSwitcher from "./public/components/language-switcher.component.vue";
import FooterContent from "./public/components/footer-content.component.vue";

export default {
  name: 'App',
  components: {FooterContent, LanguageSwitcher},
  data() {
    return {
      drawer: false,
      items: [
        {label: 'option.home',       to: '/home'},
        {label: 'option.about',      to: '/about'},
        {label: 'option.recommendations',     to: '/recommendations'},
        {label: 'option.meal_plans',     to: '/meal_plans'},
        {label: 'option.recipes',     to: '/recipes'},
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
  <pv-toast/>
  <pv-confirm-dialog/>
  <div class="flex flex-column justify-content-between">
    <header>
      <pv-toolbar class="bg-primary">
        <template #start>
          <pv-button class="p-button-text" icon="pi pi-bars" @click="toggleDrawer"/>
          <h3>Alimentate Plus</h3>
        </template>
        <template #center>
          <div class="flex-column">
            <pv-button v-for="item in items" :key="item.label" as-child v-slot="slotProps">
              <router-link :to="item.to" :class="slotProps['class']">{{ $t(item.label) }}</router-link>
            </pv-button>
          </div>
        </template>
        <template #end>
          <language-switcher/>
        </template>
      </pv-toolbar>
      <pv-drawer v-model:visible="drawer"/>
    </header>
    <main>
      <router-view/>
    </main>
    <footer>
      <footer-content/>
    </footer>
  </div>

</template>


<style scoped>

header {
  flex: 0 0 auto;
}

main {
  display: flex;
  flex-direction: column;
  height: 100%;
}

footer {
  position: absolute;
  bottom: 0;
  padding: 10px;
}

</style>
