<script setup>
import {inject, onMounted} from "vue";
import HeroSection from "@/components/HomepageSections/HeroSection.vue";
import TwoColumnWithImageSection from "@/components/HomepageSections/TwoColumnWithImageSection.vue";
import FeaturesSection from "@/components/HomepageSections/FeaturesSection.vue";
import BlogSection from "@/components/HomepageSections/BlogSection.vue";
import TestimonialsSection from "../components/HomepageSections/TestimonialsSection";
import {useApiError} from "../composables/hooks";
import Seo from "../components/Seo";
import BlogWidget from '../components/BlogSections/BlogWidget.vue'
import {useCategories} from "@/composables/hooks";
const { categories } = useCategories();
const { $butterCMS } = useNuxtApp()
const { setError } = useApiError();
const { handleMounted } = inject("layout")
const props = defineProps(['slug'])
const {data,refresh} = await useAsyncData('home-data', async () => {
  const pageSlug = props.slug ?? "landing-page-with-components";
  try{
    const page = await $butterCMS?.page.retrieve(
      "landing-page",
      pageSlug
    );
    const pageData = page?.data.data;
    //to increase number of blog posts on home screen
    const posts = await $butterCMS?.post.list({ page: 1, page_size: 3});
    const blogPosts = posts?.data.data;
    return {
      pageData,
      blogPosts
    }
  } catch (e) {
    setError(e)
    return null
  }
})
onMounted(refresh)
// onMounted(() => {
//   handleMounted(refresh)
// })
</script>
<template>
  <div>
    <seo v-bind="data.pageData.fields.seo" />
    <div v-for="(item, index) in data.pageData.fields.body">
      <hero-section
        v-if="item.type === 'hero'"
        :key="index"
        :fields="item.fields"
      />
    </div>
    <blog-section :blog-posts="data.blogPosts" />
    <section class="category">
      <div class="widget categories-widget">
      <h5 class="widget-title">Categories</h5>
      <ul class="categories-list">
        <li v-for="category in categories" :key="category.slug">
          <nuxt-link :to="`/blog/category/${category.slug}/`">
            {{ category.name }}
          </nuxt-link>
        </li>
      </ul>
    </div>
    </section>
    <div class="download">
                <a href="../assets/files/advert.pdf" download="Advert">Advertisments? Click here -></a>
        </div>
  </div>
</template>
<style scoped>
.category{
  margin-top: 4rem;
  padding-left: 5rem;
  padding-right: 5rem;
}
.download a{
    display: flex;
    justify-content: center;
    margin-top: 3rem;
}
@media only screen and (max-width: 600px) {
  .category{
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .download{
    margin-left: 1rem;
  }
}
</style>





