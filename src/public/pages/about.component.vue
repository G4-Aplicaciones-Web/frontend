<script>
export default {
  name: "about",
  title: "About Us",
}
</script>

<template>
  <div class="w-full">
    <h1>{{ $t('about.title') }}</h1>
    <p>
      {{ $t('about.mission') }}
    </p>
    <p>
      {{ $t('about.vision') }}
    </p>
    <p>
      {{ $t('about.description') }}
    </p>
  </div>
</template>


<style scoped>

</style>