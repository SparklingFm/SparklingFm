<template>
    <div class="header">
        <section>
            <div>
                <h2>Contact Sparkling FM</h2>
            <div>
                <h4><b>Address:</b></h4>
                <p> Sparkling Towers, Lemna Ikot Effangha Calabar, Cross River state, Nigeria </p>
            </div>
            <div>
                <h4><b>Email:</b></h4>
                <p>sparkling923fm@gmail.com</p>
            </div>
        </div>
        <div>
            <h2>For Marketing Enquiries</h2>
            <section>
                <div>
                <h5>Joshua Moses</h5>
                <p>General Manager</p>
                <p>Joshuamose89@gmail.com</p>
                <p>07032404903</p>
            </div>
            <div>
                <h5>Peace Nsemo</h5>
                <p>Marketing Manager</p>
                <p>nsemopeace@gmail.com</p>
                <p>08035505348</p>
            </div>
            </section>
        </div>
        </section>
         <div class="download">
                <a href="../assets/files/advert.pdf" download="Advert">Advertisments? Click here -></a>
        </div>
    </div>
</template>


<style scoped>
.header{
margin-top: 200px;
padding-left: 2rem;
padding-right: 2rem;
}
h2{
    color: orange;
    margin-bottom: 1rem;
    font-size: 2.5rem;
}
section{
    display: flex;
    justify-content: space-between;
}
.download a{
    display: flex;
    justify-content: center;
    margin-top: 5rem;
}
@media only screen and (max-width: 600px) {
    .header{
        margin-top: 100px;
        padding-left: 1rem;
        padding-right:  1rem ;
    }
  section{
    flex-direction: column;
  }
  h2{
    font-size: 2rem;
  }
}
</style>