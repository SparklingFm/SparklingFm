<template>
    <div class="header">

 <div class="header">
     <div>
        <div class="heading" id="hero-top">
            <h1 class="text-center" style="font: size 2.5rem;">OAPs</h1>
        </div>
        <section class="flexbox">
           <div class="card" id="sell-crypto">
            <a href="https://ibb.co/MVvvdjG"><img src="https://i.ibb.co/QNgg0qC/Whats-App-Image-2022-08-11-at-18-13-57.jpg" width="100%" alt="Whats-App-Image-2022-08-11-at-18-13-57" border="0"></a>
            <div class="container">
                <h4><b>Cinie Williams Ojeka</b></h4> 
                <p>He's a dynamic presenter that speaks multiple Nigerian language. He is the host of The Sparkling Morning Show and Sports Cruise. </p> 
            </div>
            </div>
            <div class="card" id="borrow-crypto">
            <img src="https://i.ibb.co/9VsQ2Lq/IMG-20220802-WA0000.jpg" width="100%" alt="IMG-20220802-WA0000" border="0">
            <div class="container">
                <h4><b>Gloria Umoh</b></h4> 
                <p>She is the host of our flagship Efik show Mkpon Editi. She is also a great reporter that has passion for stories empowering women to aspire to leadership position.</p> 
            </div>
            </div>
            <div class="card" id="sell-crypto">
            <img src="https://i.ibb.co/LvVbWY9/Whats-App-Image-2022-08-11-at-18-13-58-1.jpg" width="100%" alt="Whats-App-Image-2022-08-11-at-18-13-58-1" border="0">
            <div class="container">
                <h4><b>Essien Okon Essien</b></h4> 
                <p>Essien is a cornerstone of our Efik show Mkpo Editi. He is concerned about promoting the Efik culture and he is a community leader.</p> 
            </div>
            </div>
            <div class="card socials">
            <img src="https://i.ibb.co/kQTXp4C/JPEG-image-117-2.jpg" width="100%" alt="JPEG-image-117-2" border="0">
            <div class="container">
                <h4><b>Miracle George</b></h4> 
                <p>Popularly referred to a "George Talent". He is the host of our flagship pidgin belt "kpon kpo do". He also hosts the "Saturday Morning Show". <br> George is a comedian and events host.</p> 
            </div>
            </div>
            <div class="card" id="sell-crypto">
           <img src="https://i.ibb.co/zx1w9w1/Screenshot-20220806-133652-Facebook-2-1.jpg" width="100%" alt="Screenshot-20220806-133652-Facebook-2-1" border="0">
            <div class="container">
                <h4><b>Ukamaka Richards</b></h4> 
                <p>Co-Host of the Sparkling Morning Show.Lead Anchor of the flagship program on the station “LET’S TALK NIGERIA’’ a daily 60 minutes audience participatory program dedicated to engaging with policy makers and analyzing topical issues affecting the Nigerian state at various levels with an aim to effect change. News Anchor on World news @7am on weekdays & Sundays @7am & @12noon.Anchor of the station's rural based health programme which airs every Saturdays by 10am. Host, Church On Radio 📻</p> 
            </div>
            </div>
        </section>
     </div>
    </div>
    </div>
</template>



<style scoped>
.header{
    margin-top: 150px;
}
.flexbox{
display: flex;
justify-content: space-evenly;
flex-wrap: wrap;
}
.card {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  width: 40%;
  margin-bottom: 2rem;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

.container {
  padding: 2px 16px;
}
.container h4{
    margin-top: 1rem;
    margin-bottom: 1rem;
    text-align: center;
}
.heading{
    margin-bottom: 2rem;
}
.card img{
    height: 400px;
}
@media only screen and (max-width: 600px) {
  .flexbox{
    flex-direction: column !important;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .card{
    width: 100%;
  }
  .heading h1{
    font-size: 1.5rem;
  }
}
</style>