<script>
export default {
  name: "language-switcher",
  data() {
    return {
      languages: [],
    };
  },
  created() {
    this.languages = this.$i18n.availableLocales;
  },
  methods: {
    updateLocale(newLocale) {
      if (!newLocale) {
        console.warn("El valor del idioma es 'null', no se realizará ningún cambio.");
        return;
      }

      if (newLocale === this.$i18n.locale) {
        console.info("El idioma seleccionado ya está activo. No se realizará ningún cambio.");
        return;
      }

      if (this.languages.includes(newLocale)) {
        this.$i18n.locale = newLocale;
      } else {
        console.error(`[${newLocale}] no es un idioma válido o soportado.`);
      }
    },
  },
};
</script>

<template>
  <pv-select-button
      :model-value="$i18n.locale"
      @update:model-value="updateLocale"
      :options="languages"
  >
  <template #option="slotProps">
      {{ slotProps.option.toUpperCase() }}
    </template>
  </pv-select-button>
</template>

<style scoped>

</style>