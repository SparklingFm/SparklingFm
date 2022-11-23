<script setup>
import { onMounted, ref } from "vue";
const props = defineProps(["menuItems", "activeLink"]);

const isSticky = ref(true);
const isTogglerActive = ref(false);

const togglToggler = () => {
  isTogglerActive.value = !isTogglerActive.value;
};

const headerNavbar = ref(null);
const onScroll = () => {
  if (headerNavbar.value) {
    const sticky = headerNavbar.value.offsetTop;
    isSticky.value = window.scrollY > sticky;
  }
};
onMounted(() => {
  onScroll();
  window.document.addEventListener("scroll", onScroll, { passive: true });
  return () => window.document.removeEventListener("scroll", onScroll);
});
</script>

<template>
  <header class="header">
    <div class="navbar-area" ref="headerNavbar" :class="{ sticky: isSticky }">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-12">
            <nav class="navbar navbar-expand-lg">
              <a class="navbar-brand" href="/">
                <img src="https://i.ibb.co/QrC7C7b/logo.png"  alt="" class="img-fluid">
              </a>
              <button
                class="navbar-toggler"
                :class="{ active: isTogglerActive }"
                @click="togglToggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span class="toggler-icon"></span>
                <span class="toggler-icon"></span>
                <span class="toggler-icon"></span>
              </button>

              <div
                :class="{ show: isTogglerActive }"
                class="collapse navbar-collapse sub-menu-bar"
                id="navbarSupportedContent"
              >
                <div class="ms-auto">
                  <ul id="nav" class="navbar-nav ms-auto">
                    <!-- <li
                      v-for="menuItem in props.menuItems"
                      :key="menuItem.url"
                      class="nav-item"
                    >
                      <a
                        class="nav-link page-scroll"
                        :class="{ active: activeLink === '/' + menuItem.url }"
                        :href="'/' + menuItem.url"
                        @click="isTogglerActive = false"
                        >{{ menuItem.label }}</a
                      >
                    </li> -->
                    <li><nuxt-link to="/" class="nuxt-link-exact-active">Home</nuxt-link></li>
                    <li><nuxt-link tag="li"  to="/About" class="nuxt-link-exact-active">About</nuxt-link></li>
                    <li><nuxt-link tag="li"  to="/Oap" class="nuxt-link-exact-active">OAPs</nuxt-link></li>
                    <li><nuxt-link to="/blog/" class="nuxt-link-exact-active">News</nuxt-link></li>
                    <li tag="li"><nuxt-link to="/Program" class="nuxt-link-exact-active">Programmes</nuxt-link></li>
                    <li><nuxt-link to="/Contact" class="nuxt-link-exact-active">Contact</nuxt-link></li>
                    
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.toggler-icon{
  background-color: #fff;
  color: aliceblue;
}
li{
  margin-left: 20px;
  color: orange;
}
a{
  color: orange;
  font-weight: bolder;
  text-transform: uppercase;
}
.nuxt-link-exact-active{
  font-weight: bold;
  color: #00c58e;
}
/* exact link will show the primary color for only the exact matching link */
a.nuxt-link-exact-active {
  color: rgb(255, 145, 0);
}
/* a:hover{
  border-bottom: 2px solid orange;
} */
ul a::after {
    content: '';
    display: block;
    width: 0;
    height: 2px;
    background: whitesmoke;
    transition: width .3s;
}
ul a:hover::after {
    width: 100%;
    transition: width .9s;
}
.img-fluid{
  height: 50px;
}
</style>
