<template>
    <div class="header" id="hero-top">
        <section>
            <h1>ABOUT US</h1>
       <p>Sparkling 92.3 fm is a radio station in the heart of Calabar, Cross River state, Nigeria. It was launched in 2018 to capture the thought, heart and mood of a diverse audience through our broad based but specific programming and music playlist.

Our shows present you, the listener,  with a full treat of what is happening in the news from our local scene to the international stage while we also have a good dose of politics, sports and business contents to pick from and it is very engaging and interactive.  Your day has never been better.

Our music is second to one because we play the latest afrobeats tunes, down to the old but gold Nigerian songs of the sixties, seventies, eighties and nineties. We never miss the trend when it comes to music and promoting the craft.

You can always trust us to provide affordable advert rates to meet your advertising needs.

You can check out our programmes and presenters.</p>
        </section>
<div class="d-flex justify-content-center" id="link">
   <nuxt-link to="/Program">Check our Programmes</nuxt-link>
   <div class="download">
      <a href="../assets/files/advert.pdf" download="Advert">Download our Adverts Rate</a>
    </div>
</div>
    </div>
</template>


<style scoped>
section{
    margin-top: 200px;
    padding: 2rem;
}
h1{
    font-size: 2.5rem;
    text-align: center;
    padding-bottom: 1.5rem;
}
#link{
    justify-content: center;
}
#link a {
    color: orange;
}
#link a:hover {
  color: black;
}
.download{
    margin-left: 1rem;
}
@media only screen and (max-width: 600px) {
 #link{
    display: block !important;
    justify-content: center !important;
    align-items: center !important;
    padding-left: 2rem;
 }
 .download{
    margin-left: 0rem;
 }
 section{
    margin-top: 100px;
 }
}
</style>