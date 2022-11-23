<template>
<Html>
  <Head>
    <Title>{{title}}</Title>
    <Meta name="description" :content="description" />
    <Meta v-if="image" name="image" :content="image" />
    <Link rel="icon" href="https://i.ibb.co/QrC7C7b/logo.png" />
  </Head>
</Html>
</template>

<script setup>
defineProps(["title", "description", "image"]);
</script>

<style scoped></style>
