<template>
<div class="body">
 <div class="hero">
  <div class="hero-article">
    <div class="hero-text">
      <h1 class="lg-text">Relax and Enjoy the<br> <span class="colored-text"> Best FM </span> on the<br> planet earth...</h1>
      <h1 class="mobile-text">Relax and Enjoy the <span class="colored-text"> Best FM </span> on the planet earth...</h1>
    </div>
    <div class="hero-para">
      <p>Listen to exciting talks about sport, recent<br> news, dramas, relationships and many more on<br> sparkling FM</p>
    </div>
    <div class="hero-links">
      <a style="background-color:rgba(229, 137, 70, 1);" href="#C4" class=" listen nuxt-link-exact-active" id="listen">Listen Live</a>
      <nuxt-link class="second-link" to="/blog/">Read our Articles</nuxt-link>
    </div>
  </div>
  <div class="hero-img">
    <div class="w3-content w3-section" style="max-width:500px">
<div class="mySlides slideshow-container">
          <img src="~/assets/images/hero-img.png" style="width:100%">
          <h1 class="numbertext">1 / 10</h1>
      </div>

      <div class="mySlides slideshow-container">
          <img src="~/assets/images/slide.jpeg" style="width:100%">
          <h1 class="numbertext">2 / 10</h1>
      </div>
  <div class="mySlides slideshow-container">
          <img src="~/assets/images/slide2.jpeg" style="width:100%">
          <h1 class="numbertext">3 / 10</h1>
      </div>

      <div class="mySlides slideshow-container">
          <img src="~/assets/images/slide3.jpeg" style="width:100%">
          <h1 class="numbertext">4 / 10</h1>
      </div>

      <div class="mySlides slideshow-container">
          <img src="~/assets/images/slide4.jpeg" style="width:100%">
          <h1 class="numbertext">5 / 10</h1>
      </div>

      <div class="mySlides slideshow-container">
          <img src="~/assets/images/slide5.jpeg" style="width:100%">
          <h1 class="numbertext">6 / 10</h1>
      </div>

      <div class="mySlides slideshow-container">
          <img src="~/assets/images/slide6.jpeg" style="width:100%">
          <h1 class="numbertext">7 / 10</h1>
      </div>

      <div class="mySlides slideshow-container">
          <img src="~/assets/images/slide7.jpeg" style="width:100%">
          <h1 class="numbertext">8 / 10</h1>
      </div>

      <div class="mySlides slideshow-container">
          <img src="~/assets/images/slide8.jpeg" style="width:100%">
          <h1 class="numbertext">9 / 10</h1>
      </div>

      <div class="mySlides slideshow-container">
          <img src="~/assets/images/slide9.jpeg" style="width:100%">
          <h1 class="numbertext">10 / 10</h1>
      </div>
</div>
  </div>
  </div>
  <div class="iframe" id="C4">
    <div>
    <iframe loading="lazy" src="https://mixlr.com/users/2614208/embed" width="100%" height="180px" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
  </div>
  </div>
</div>
</template>

<script setup>
const props = defineProps(["fields"]);

onMounted(() => {
   var myIndex = 0;
carousel(myIndex);


function carousel() {
  var i;
  var x = document.getElementsByClassName("mySlides");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  myIndex++;
  if (myIndex > x.length) {myIndex = 1}    
  x[myIndex-1].style.display = "block";  
  setTimeout(carousel, 9000); // Change image every 2 seconds
}
})
</script>

<style scoped>
.iframe{
  margin-top: 6rem;
  margin-left: 5rem;
  margin-right: 5rem;
}
.mySlides{
  animation-duration: 3s;
  animation-name: fade;
}
@keyframes fade {
  from {opacity: .4} 
  to {opacity: 1}
}
.hero{
  display: flex;
  justify-content: space-around;
  height: auto;
  padding-top: 10rem;
  padding-left: 5rem;
  padding-right: 4rem;
}
.hero-text{
  margin-bottom: 2rem;
}
.hero-text h1{
  font-size: 40px;
}
.mobile-text{
  display: none;
}
/* .hero-img{
  width: 50%;
} */
.hero-img img{
  height: 500px;
}
.hero-article{
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
}
.hero-links{
  display: flex;
}
.hero-links a{
  padding-top: 0.7rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 0.7rem;
  background-color: black;
  color: white;
  border-radius: 2px;
}
.hero-para{
  margin-bottom: 3rem;
}
.second-link{
  margin-left: 15px;
}
.colored-text{
  color: rgba(229, 137, 70, 1);
}

.listen:hover{
  background-color: #717171;
}
@media only screen and (max-width: 900px) {
  .hero{
    flex-direction: column;
    margin-top: -5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    justify-content: space-evenly;
  }
  .hero-img{
    margin-top: 3rem;
  }
  .hero-img img{
    width: 100%;
  }
  .lg-text{
    display: none;
  }
  .hero-text h1{
    font-size: 29px;
  }
  .mobile-text{
    display: block;
  }
  .hero-links{
    display: flex;
  }
  .hero-links a{
    padding-top: 0.2rem;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    padding-bottom: 0.2rem;
  }
}

#listen:hover{
 background-color: #717171;
}

/*slideshow*/
.mySlides {display: none;}
img {vertical-align: middle;}

/* Slideshow container */
.slideshow-container {
  max-width: 1000px;
  position: relative;
  margin: auto;
}

/* Caption text */
.text {
  color: #f2f2f2;
  font-size: 15px;
  padding: 8px 12px;
  position: absolute;
  bottom: 8px;
  width: 100%;
  text-align: center;
}

/* Number text (1/3 etc) */
.numbertext {
  color: #f2f2f2;
  font-size: 12px;
  padding: 8px 12px;
  position: absolute;
  top: 0;
}

/* The dots/bullets/indicators */
.dot {
  height: 15px;
  width: 15px;
  margin: 0 2px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.6s ease;
}

.active {
  background-color: #717171;
}

/* Next & previous buttons */
.prev, .next {
  cursor: pointer;
  position: absolute;
  top: 50%;
  width: auto;
  margin-top: -22px;
  padding: 16px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  transition: 0.6s ease;
  border-radius: 0 3px 3px 0;
  user-select: none;
}

.mySlides img{
  width: 700px;
  height: 450px;
}

/* Position the "next button" to the right */
.next {
  right: 0;
  border-radius: 3px 0 0 3px;
}

/* On hover, add a black background color with a little bit see-through */
.prev:hover, .next:hover {
  background-color: rgba(0,0,0,0.8);
}

/* Fading animation */
.fade {
  animation-name: fade;
  animation-duration: 7s;
}

@keyframes fade {
  0% {opacity: 0.1}
  /* 25% {opacity: 0.4}
  50% { opacity: 0.6} */
  100% {opacity: 1}
}

/* On smaller screens, decrease text size */
@media only screen and (max-width: 600px) {
  .mySlides img{
    width: 100%;
  }
  .dot{
    display: none;
  }
  .iframe{
  margin-top: 4rem;
  margin-left: 1rem;
  margin-right: 1rem;
}
}
/* On smaller screens, decrease text size */
@media only screen and (max-width: 300px) {
  .text {font-size: 11px}
}

</style>

