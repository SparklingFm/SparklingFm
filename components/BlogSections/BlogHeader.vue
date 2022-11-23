<template>
  <section id="blog-roll" class="blog-roll-nav">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12">
          <div class="section-title text-center">
            <h2>{{ heading }}</h2>
            <ul class="breadcrumb-nav">
              <li v-for="link in links" :key="link.to">
                <router-link :to="link.to">{{ link.text }}</router-link>
              </li>
              <li>{{ text }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps(["heading", "links", "text"]);
</script>

<style scoped>
@media only screen and (max-width: 600px) {
  .section-title{
    margin-top: -5rem;
  margin-bottom: -4rem;
}
.section-title h2{
  font-size: 1.8rem;
}
.breadcrumb-nav{
  display: none;
}
}
@media only screen and (max-width: 800px) {
.breadcrumb-nav{
  display: none;
}
}

</style>
