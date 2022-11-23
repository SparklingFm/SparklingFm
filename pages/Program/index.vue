<template>
    <div class="header">
      <div class="flex  items-center justify-center lg:my-20 lg:mx-20">
                    <div class="w-full">
                        <ul class="flex mb-0 list-none space-y-2  justify-between"
                            id="tab-btn">
                            <div class="d-flex flex-row space-x-1 justify-center">
                                <li class=" flex-auto text-center">
                                    <a class="text-xs font-extrabold px-5 py-3 shadow-lg rounded block leading-normal"
                                        v-on:click="toggleTabs(1)"
                                        v-bind:class="{ 'inactivetab': openTab !== 1, 'active-tab': openTab === 1 }">
                                        Mondays
                                    </a>
                                </li>
                                <li class="last:mr-0 flex-auto text-center">
                                    <a class="text-xs  font-extrabold  px-5 py-3 shadow-lg rounded block leading-normal"
                                        v-on:click="toggleTabs(2)"
                                        v-bind:class="{ 'inactivetab': openTab !== 2, 'active-tab': openTab === 2 }">
                                        Tuesdays
                                    </a>
                                </li>
                                <li class="last:mr-0 flex-auto text-center">
                                    <a class="text-xs  font-extrabold  px-5 py-3 shadow-lg rounded block leading-normal"
                                        v-on:click="toggleTabs(3)"
                                        v-bind:class="{ 'inactivetab': openTab !== 3, 'active-tab': openTab === 3 }">
                                        Wednesday
                                    </a>
                                </li>
                                 <li class="last:mr-0 flex-auto text-center">
                                    <a class="text-xs  font-extrabold  px-5 py-3 shadow-lg rounded block leading-normal"
                                        v-on:click="toggleTabs(4)"
                                        v-bind:class="{ 'inactivetab': openTab !== 4, 'active-tab': openTab === 4 }">
                                        Thursday
                                    </a>
                                </li>
                                <li class="last:mr-0 flex-auto text-center">
                                    <a class="text-xs  font-extrabold  px-5 py-3 shadow-lg rounded block leading-normal"
                                        v-on:click="toggleTabs(5)"
                                        v-bind:class="{ 'inactivetab': openTab !== 5, 'active-tab': openTab === 5 }">
                                        Fridays
                                    </a>
                                </li>
                                <li class="last:mr-0 flex-auto text-center">
                                    <a class="text-xs  font-extrabold  px-5 py-3 shadow-lg rounded block leading-normal"
                                        v-on:click="toggleTabs(6)"
                                        v-bind:class="{ 'inactivetab': openTab !== 6, 'active-tab': openTab === 6 }">
                                        Saturdays
                                    </a>
                                </li>
                                <li class="last:mr-0 flex-auto text-center">
                                    <a class="text-xs  font-extrabold  px-5 py-3 shadow-lg rounded block leading-normal"
                                        v-on:click="toggleTabs(7)"
                                        v-bind:class="{ 'inactivetab': openTab !== 7, 'active-tab': openTab === 7 }">
                                        Sundays
                                    </a>
                                </li>
                            </div>
                        </ul>
                                <div class="tab-content tab-space w-full table">
                                    <div v-bind:class="{ ' inactive': openTab !== 1, 'active': openTab === 1 }">
                                        <table>
                                            <tr>
                                                <th>#</th>
                                                <th>Time</th>
                                                <th>Programmes</th>
                                            </tr>
                                            <tr>
                                                <td>1</td>
                                                <th>5am - 10 am</th>
                                                <th><b>THE SPARKLING MORNING SHOW</b>                                                <br>
                                                    MUSIC/MOTIVATION<br>
                                                    Area Talk<br>
                                                    World News<br>
                                                    Sports Trail<br>
                                                    Newspaper Review<br>
                                                    Sparkling Business 360<br>
                                                    Let’s Talk NIGERIA<br>
                                                </th>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>10am -2pm</td>
                                                <td>
                                                    News Update<br>   
                                                    <b>The Mid-Morning Show</b>                               
                                                    <br>
                                                    Headline<br> News<br>
                                                    The Newsroom<br>
                                                    Lunch time oldies<br>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>2pm-5pm</td>
                                                <td>
                                                    <b>Pidgin Belt</b><br>
                                                 Kponkporo<br>
                                                    My Domot<br>
                                                    Business show<br>
                                                    Football Tori<br>   
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>6pm - 8pm</td>
                                                <td>
                                                World <br>
                                                Efik Show<br>
                                                Talk Your Own(BBC)<br>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>5</td>
                                                <td>9pm -12am</td>
                                                <td>
                                                    The Night Zone<br>
                                                    Real life tales<br>
                                                    Good night kisses<br>
                                                </td>
                                            </tr>
                                            </table> 
                                    </div>
                                     <div>
                                        <!--Tab 1 closes-->
                                <div class="tab-content tab-space w-full">
                                    <div v-bind:class="{ ' inactive': openTab !== 2, 'active': openTab === 2 }">
                                         <table>
                                            <tr>
                                                <th>#</th>
                                                <th>Time</th>
                                                <th>Programmes</th>
                                            </tr>
                                            <tr>
                                                <td>1</td>
                                                <th>5am - 10 am</th>
                                                <th><b>THE SPARKLING MORNING SHOW</b>                                                <br>
                                                    MUSIC/MOTIVATION<br>
                                                    Area Talk<br>
                                                    World News<br>
                                                    Sports Trail<br>
                                                    Newspaper Review<br>
                                                    Sparkling Business 360<br>
                                                    Let’s Talk NIGERIA<br>
                                                </th>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>10am -2pm</td>
                                                <td>
                                                    <b>News Update</b> <br>                                  
                                                    The Mid-Morning Show<br>
                                                    Headline News<br>
                                                    The Newsroom<br>
                                                    Lunch time oldies<br>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>2pm-5pm</td>
                                                <td>
                                                    <b>Pidgin Belt</b><br>
                                                 Kponkporo<br>
                                                    My Domot<br>
                                                    Interpret d law<br>
                                                    Football Tori<br>   
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>6pm - 8pm</td>
                                                <td>
                                                World <br>
                                                Efik Show<br>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>5</td>
                                                <td>9pm -12am</td>
                                                <td>
                                                    Double Dose<br>
                                                    Family Table<br>
                                                    Good night kisses<br>
                                                </td>
                                            </tr>
                                            </table> 
                                    </div>
                                </div>
                                    <!--Tab 2 closes-->
                                     <div>
                                <div class="tab-content tab-space w-full">
                                    <div v-bind:class="{ ' inactive': openTab !== 3, 'active': openTab === 3 }">
                                        <table>
                                            <tr>
                                                <th>#</th>
                                                <th>Time</th>
                                                <th>Programmes</th>
                                            </tr>
                                            <tr>
                                                <td>1</td>
                                                <th>5am - 10 am</th>
                                                <th><b>THE SPARKLING MORNING SHOW</b>                                                <br>
                                                    MUSIC/MOTIVATION<br>
                                                    Area Talk<br>
                                                    World News<br>
                                                    Sports Trail<br>
                                                    Newspaper Review<br>
                                                    Sparkling Business 360<br>
                                                    Let’s Talk NIGERIA<br>
                                                </th>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>10am -2pm</td>
                                                <td>
                                                    News Update<br>   
                                                    <b>Musical Wednesday</b>                               
                                                    <br>
                                                    Headline<br> News<br>
                                                    <b>COVID 19 TALKS</b><br>
                                                    The Newsroom<br>     
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>2pm-5pm</td>
                                                <td>
                                                    <b>Musical Wednesday</b><br>
                                                    Football Tori<br>   
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>6pm - 8pm</td>
                                                <td>
                                                World News<br>
                                                Sound Box<br>
                                                Musical Wednesday<br>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>5</td>
                                                <td>9pm -12am</td>
                                                <td>
                                                    Musical Wednesday
                                                </td>
                                            </tr>
                                            </table>  
                                    </div>
                                </div>
                                    <!--Tab 3 closes-->
                                <div class="tab-content tab-space w-full">
                                    <div v-bind:class="{ ' inactive': openTab !== 4, 'active': openTab === 4 }">
                                          <table>
                                            <tr>
                                                <th>#</th>
                                                <th>Time</th>
                                                <th>Programmes</th>
                                            </tr>
                                            <tr>
                                                <td>1</td>
                                                <th>5am - 10 am</th>
                                                <th><b>THE SPARKLING MORNING SHOW</b>                                                <br>
                                                    MUSIC/MOTIVATION<br>
                                                    Area Talk<br>
                                                    World News<br>
                                                    Sports Trail<br>
                                                    Newspaper Review<br>
                                                    Sparkling Business 360<br>
                                                    Let’s Talk NIGERIA<br>
                                                </th>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>10am -2pm</td>
                                                <td>
                                                    <b>News Update</b> <br>                                  
                                                    The Mid-Morning Show<br>
                                                    Headline News<br>
                                                    The Newsroom<br>
                                                    Lunch time oldies<br>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>2pm-5pm</td>
                                                <td>
                                                    <b>Pidgin Belt</b><br>
                                                 Kponkporo<br>
                                                    My Domot<br>
                                                    Interpret d law<br>
                                                    Football Tori<br>   
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>6pm - 8pm</td>
                                                <td>
                                                World News<br>
                                                Efik Show<br>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>5</td>
                                                <td>9pm -12am</td>
                                                <td>
                                                    Nostalgia <br>
                                                    Dating gist<br>
                                                    Hook up show<br>
                                                    Good night kisses<br>
                                                </td>
                                            </tr>
                                            </table> 
                                    </div>
                                </div>
                                <!--tab 4 closes-->
                                <div class="tab-content tab-space w-full">
                                    <div v-bind:class="{ ' inactive': openTab !== 5, 'active': openTab === 5 }">
                                          <table>
                                            <tr>
                                                <th>#</th>
                                                <th>Time</th>
                                                <th>Programmes</th>
                                            </tr>
                                            <tr>
                                                <td>1</td>
                                                <th>5am - 10 am</th>
                                                <th><b>THE SPARKLING MORNING SHOW</b>                                                <br>
                                                    MUSIC/MOTIVATION<br>
                                                    Area Talk<br>
                                                    World News<br>
                                                    Sports Trail<br>
                                                    Newspaper Review<br>
                                                    Sparkling Business 360<br>
                                                    Let’s Talk NIGERIA<br>
                                                </th>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>10am -2pm</td>
                                                <td>
                                                    <b>News Update</b> <br>                                  
                                                    The Mid-Morning Show<br>
                                                    Headline News<br>
                                                    The Newsroom<br>
                                                    Lunch time oldies<br>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>2pm-5pm</td>
                                                <td>
                                                    <b>Pidgin Belt</b><br>
                                                 Kponkporo<br>
                                                    My Domot<br>
                                                    Transcorps 360<br>
                                                    Football Tori<br>   
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>6pm - 8pm</td>
                                                <td>
                                                World News<br>
                                                Eckankar half hour<br>
                                                Upper Room Half hour
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>5</td>
                                                <td>9pm -12am</td>
                                                <td>
                                                    MUSIC
                                                </td>
                                            </tr>
                                            </table> 
                                    </div>
                                </div>
                                    <!--tab 5 closes-->
                                <div class="tab-content tab-space w-full">
                                    <div v-bind:class="{ ' inactive': openTab !== 6, 'active': openTab === 6 }">
                                        <table>
                                            <tr>
                                                <th>#</th>
                                                <th>Time</th>
                                                <th>Programmes</th>
                                            </tr>
                                            <tr>
                                                <td>1</td>
                                                <td>5am - 12pm</td>
                                                <td>
                                                    <b>THE SATURDAY EXPERIENCE</b> <br>                                                
                                                    Good morning Calabar <br>
                                                    World News <br>
                                                    Paper  Review <br>
                                                    CR Times <br>
                                                    Banter Show <br>
                                                    Health Show <br>
                                                    Yala Show <br>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>12pm - 5pm</td>
                                                <td>
                                                    News in Retrospect <br>
                                                    <b>Sports Cruise</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    3
                                                </td>
                                                <td>5pm - 6pm</td>
                                                <td>
                                                    Music
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>6pm - 8pm</td>
                                                <td>
                                                    World News <br>
                                                    <b>Dunamis</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>5</td>
                                                <td>Music</td>
                                                <td>Music</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                    <!--tab 6 closes-->
                                <div class="tab-content tab-space w-full">
                                    <div v-bind:class="{ ' inactive': openTab !== 7, 'active': openTab === 7 }">
                                     <table>
                                            <tr>
                                                <th>#</th>
                                                <th>Time</th>
                                                <th>Programmes</th>
                                            </tr>
                                            <tr>
                                                <td>1</td>
                                                <td>5am - 12pm</td>
                                                <td>
                                                    <b>CHURCH ON RADIO</b> <br>                                                    
                                                    MUSIC <br>
                                                    World News <br>
                                                    Prayer Time <br>
                                                    Gospel Chit Chat <br>
                                                    Praise Jam <br>
                                                    Sparkling mail <br>
                                                    Country music
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>12pm - 5pm</td>
                                                <td>
                                                    World News <br>
                                                    <b>Sunday Afternoon Experience</b> <br>
                                                    Efik Show
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    3
                                                </td>
                                                <td>6pm - 8pm</td>
                                                <td>
                                                    World News <br>
                                                    Sparkling Request show <br>
                                                    Upper Room <br>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>8pm - 12pm</td>
                                                <td>
                                                    Music <br>
                                                    <b>Upper Room HALF HOUR</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>5</td>
                                                <td>Music</td>
                                                <td>Music</td>
                                            </tr>
                                        </table>
                                    </div>
                                    </div>
                                    <!--tab 7 closes-->
                                </div>
                            </div>
                            </div>
                                     </div>
                        </div>
                 <div class="download">
                <a href="../assets/files/advert.pdf" download="Advert">Download our Adverts Rate</a>
        </div>
    </div>
</template>

<script setup>
import { ref} from 'vue'

const openTab = ref(1);
function toggleTabs(tabNumber) {
    this.openTab = tabNumber;
}

</script>

<style scoped>
.header{
    margin-top: 150px;
    /* background: #010714; */
}
.inactive{
    display: none;
    color: yellowgreen;
}
.active{
    display: inline-block;
    color: black;
}
#tab-btn {
    padding-left: 4rem;
    padding-bottom: 0 !important;
    overflow: scroll;
}
#tab-btn li{
    background: #161A24;
    color: #fff;
}
#tab-btn li a{
    color: #fff;
}
#tab-btn li:first-child{
    border-top-left-radius: 10px;
}
#tab-btn li:last-child{
    border-top-right-radius: 10px;
}
.tab-content{
    padding-left: 3rem;
    padding-right: 3rem;
}
/* tables */
table {
    margin-top: 4rem;
    margin-left: 15rem;
    border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  border: 1px solid #ddd;
}
th, td {
  text-align: left;
  padding: 8px;
}
tr:nth-child(even){background-color: #f2f2f2}
.table{
    overflow: scroll;
}

.active-tab:after {
    content: "";
    display: block;
    margin: 0 auto;
    width: 30px;
    padding-top: 5px;
    border-bottom: 3px solid rgb(255, 132, 0);
}
.download a{
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}
@media only screen and (max-width: 600px) {
  #tab-btn{
    padding-left: 0.4rem;
  }
  .tab-content{
    padding-left: 0.4rem;
    padding-right: 0.4rem;
  }
  table{
    margin-top: 1rem;
    margin-left: 0.1rem;
  }
  .download{
    margin-left: 1rem;
  }
}
</style>