<template>
  <footer class="footer pt-120 absolute bottom-0">
    <div class="container">
      <div class="row">
        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-10">
          <div class="footer-widget">
            <div class="logo">
              <a href="#">
              <img src="https://i.ibb.co/QrC7C7b/logo.png" 
              width="130px"
              alt="logo" border="0"></a>
            </div>
            <p class="desc">
              Your radio,your shine!
            </p>
            <ul class="social-links">
              <li>
                <a href="https://m.facebook.com/sparkling92.3fm"><i class="lni lni-facebook"></i></a>
              </li>
              <li>
                <a href="#0"><i class="lni lni-instagram"></i></a>
              </li>
              <li>
                <a href="#0"><i class="lni lni-twitter"></i></a>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-xl-5 col-lg-4 col-md-12 col-sm-12 offset-xl-1 contact">
          <div class="footer-widget text-center">
            <h2>Contact Us</h2>
            <ul class="links">
              <li><b>Address:</b>Sparkling Towers Royal Farm Estate Water intake road off Lemma road Ikot Effanga, Calabar,Nigeria </li>
              <li><b>Email:</b>Sparkling923fm@gmail.com</li>
              <div>
                <li><b>Telephone: </b>07037404903</li>
              </div>
              <li class="butter-logo"><a href="https://buttercms.com">
              <a href="https://buttercms.com/"><img src="https://i.ibb.co/GTmKBYX/butter-b.png" width="200px" alt="butter-b" border="0"></a>
              </a></li>
            </ul>
          </div>
        </div>

        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="footer-widget">
            <h3>Subscribe Newsletter</h3>
            <form action="#">
              <input type="email" placeholder="Email" />
              <button class="main-btn btn-hover">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">
      <p class="text-center">© Copyright 2023 - SPARKLING FM CALABAR</p> <p class="slash">| </p><p>Powered by <a href="1dev.com.ng" style="color:orange;">1DEV</a></p>
    </div>
  </footer>
</template>

<script setup>
defineProps(["menuItems", "activeLink"]);
</script>

<style scoped>
.copyright{
  display: flex;
  justify-content: center;
  align-items: center;
}
.slash{
  margin-left: 4px;
  margin-right: 4px;
}
.footer-widget {
  margin-top: 1rem;
  margin-right: 2rem;
}
.footer-widget li{
  margin-top: 1rem;
}
.footer-widget h2{
  font-size: 1.5rem;
  margin-bottom: 1.6rem;
}
@media only screen and (max-width: 600px) {
  .copyright{
    flex-direction: column;
    justify-content: center;
  }
  .slash{
    display: none;
  }
  .footer-widget h2{
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
  .links li{
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }
  .copyright p{
    font-size: 0.5rem;
  }
  .footer-widget h3{
    font-size: 1.2rem;
  }
  .footer-widget {
  margin-top: 1rem;
  margin-right: 2rem;
}
.butter-logo{
  display: none;
}
}
@media screen and (max-width: 250px) {
  .butter-logo{
    display: none;
  }
  .logo{
    display: none;
  }
  
}
</style>
