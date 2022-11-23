import{_ as v,r,s as p,o as f,c as _,a as t,n as y,b as c,w as u,p as j,d as K,f as m,e as R,g as $,I,Y as P,C as N,Z as Y,y as L,D as V,J as B,H}from"./entry-41b4a931.mjs";const M={name:"Header",props:["menuItems","activeLink"],setup(a,{expose:s}){s();const o=a,e=r(!0),n=r(!1),l=()=>{n.value=!n.value},i=r(null),d=()=>{if(i.value){const h=i.value.offsetTop;e.value=window.scrollY>h}};p(()=>(d(),window.document.addEventListener("scroll",d,{passive:!0}),()=>window.document.removeEventListener("scroll",d)));const g={props:o,isSticky:e,isTogglerActive:n,togglToggler:l,headerNavbar:i,onScroll:d,onMounted:p,ref:r};return Object.defineProperty(g,"__isScriptSetup",{enumerable:!1,value:!0}),g}},S=a=>(j("data-v-78d7123e"),a=a(),K(),a),U={class:"header"},G={class:"container"},Q={class:"row align-items-center"},q={class:"col-lg-12"},z={class:"navbar navbar-expand-lg"},D=S(()=>t("a",{class:"navbar-brand",href:"/"},[t("img",{src:"https://i.ibb.co/QrC7C7b/logo.png",alt:"",class:"img-fluid"})],-1)),J=S(()=>t("span",{class:"toggler-icon"},null,-1)),W=S(()=>t("span",{class:"toggler-icon"},null,-1)),X=S(()=>t("span",{class:"toggler-icon"},null,-1)),Z=[J,W,X],ee={class:"ms-auto"},te={id:"nav",class:"navbar-nav ms-auto"},oe=m("Home"),ae=m("About"),se=m("OAPs"),ne=m("News"),ie={tag:"li"},le=m("Programmes"),ce=m("Contact");function re(a,s,o,e,n,l){const i=R;return f(),_("header",U,[t("div",{class:y(["navbar-area",{sticky:e.isSticky}]),ref:"headerNavbar"},[t("div",G,[t("div",Q,[t("div",q,[t("nav",z,[D,t("button",{class:y(["navbar-toggler",{active:e.isTogglerActive}]),onClick:e.togglToggler,type:"button","data-bs-toggle":"collapse","data-bs-target":"#navbarSupportedContent","aria-controls":"navbarSupportedContent","aria-expanded":"false","aria-label":"Toggle navigation"},Z,2),t("div",{class:y([{show:e.isTogglerActive},"collapse navbar-collapse sub-menu-bar"]),id:"navbarSupportedContent"},[t("div",ee,[t("ul",te,[t("li",null,[c(i,{to:"/",class:"nuxt-link-exact-active"},{default:u(()=>[oe]),_:1})]),t("li",null,[c(i,{tag:"li",to:"/About",class:"nuxt-link-exact-active"},{default:u(()=>[ae]),_:1})]),t("li",null,[c(i,{tag:"li",to:"/Oap",class:"nuxt-link-exact-active"},{default:u(()=>[se]),_:1})]),t("li",null,[c(i,{to:"/blog/",class:"nuxt-link-exact-active"},{default:u(()=>[ne]),_:1})]),t("li",ie,[c(i,{to:"/Program",class:"nuxt-link-exact-active"},{default:u(()=>[le]),_:1})]),t("li",null,[c(i,{to:"/Contact",class:"nuxt-link-exact-active"},{default:u(()=>[ce]),_:1})])])])],2)])])])])],2)])}var de=v(M,[["render",re],["__scopeId","data-v-78d7123e"]]);const ve={name:"Footer",props:["menuItems","activeLink"],setup(a,{expose:s}){s();const o={};return Object.defineProperty(o,"__isScriptSetup",{enumerable:!1,value:!0}),o}},fe={class:"footer pt-120 absolute bottom-0"},_e=$('<div class="container" data-v-58f1df96><div class="row" data-v-58f1df96><div class="col-xl-3 col-lg-4 col-md-6 col-sm-10" data-v-58f1df96><div class="footer-widget" data-v-58f1df96><div class="logo" data-v-58f1df96><a href="#" data-v-58f1df96><img src="https://i.ibb.co/QrC7C7b/logo.png" width="130px" alt="logo" border="0" data-v-58f1df96></a></div><p class="desc" data-v-58f1df96> Your radio,your shine! </p><ul class="social-links" data-v-58f1df96><li data-v-58f1df96><a href="https://m.facebook.com/sparkling92.3fm" data-v-58f1df96><i class="lni lni-facebook" data-v-58f1df96></i></a></li><li data-v-58f1df96><a href="#0" data-v-58f1df96><i class="lni lni-instagram" data-v-58f1df96></i></a></li><li data-v-58f1df96><a href="#0" data-v-58f1df96><i class="lni lni-twitter" data-v-58f1df96></i></a></li></ul></div></div><div class="col-xl-5 col-lg-4 col-md-12 col-sm-12 offset-xl-1 contact" data-v-58f1df96><div class="footer-widget text-center" data-v-58f1df96><h2 data-v-58f1df96>Contact Us</h2><ul class="links" data-v-58f1df96><li data-v-58f1df96><b data-v-58f1df96>Address:</b>Sparkling Towers Royal Farm Estate Water intake road off Lemma road Ikot Effanga, Calabar,Nigeria </li><li data-v-58f1df96><b data-v-58f1df96>Email:</b>Sparkling923fm@gmail.com</li><div data-v-58f1df96><li data-v-58f1df96><b data-v-58f1df96>Telephone: </b>07037404903</li></div><li class="butter-logo" data-v-58f1df96><a href="https://buttercms.com" data-v-58f1df96><a href="https://buttercms.com/" data-v-58f1df96><img src="https://i.ibb.co/GTmKBYX/butter-b.png" width="200px" alt="butter-b" border="0" data-v-58f1df96></a></a></li></ul></div></div><div class="col-xl-3 col-lg-4 col-md-6" data-v-58f1df96><div class="footer-widget" data-v-58f1df96><h3 data-v-58f1df96>Subscribe Newsletter</h3><form action="#" data-v-58f1df96><input type="email" placeholder="Email" data-v-58f1df96><button class="main-btn btn-hover" data-v-58f1df96>Subscribe</button></form></div></div></div></div><div class="copyright" data-v-58f1df96><p class="text-center" data-v-58f1df96>\xA9 Copyright 2022 - SPARKLING FM CALABAR</p> <p class="slash" data-v-58f1df96>| </p><p data-v-58f1df96>Powered by <a href="#0" style="color:orange;" data-v-58f1df96>1DEV</a></p></div>',2),ue=[_e];function pe(a,s,o,e,n,l){return f(),_("footer",fe,ue)}var me=v(ve,[["render",pe],["__scopeId","data-v-58f1df96"]]);const he={name:"ScrollToTop",setup(a,{expose:s}){s();const o=r(!1);p(()=>{const n=l=>{o.value=document.body.scrollTop>50||document.documentElement.scrollTop>50};return window.document.addEventListener("scroll",n,{passive:!0}),()=>window.document.removeEventListener("scroll",n)});const e={isVisible:o,onMounted:p,ref:r};return Object.defineProperty(e,"__isScriptSetup",{enumerable:!1,value:!0}),e}},ge=t("i",{class:"lni lni-chevron-up"},null,-1),be=[ge];function xe(a,s,o,e,n,l){return f(),_("a",{href:"#",class:y(["scroll-top btn-hover d-flex",{"d-none":!e.isVisible}])},be,2)}var we=v(he,[["render",xe]]);const ke={},ye={class:"preloader"},Se=$('<div class="loader"><div class="spinner"><div class="spinner-container"><div class="spinner-rotator"><div class="spinner-left"><div class="spinner-circle"></div></div><div class="spinner-right"><div class="spinner-circle"></div></div></div></div></div></div>',1),Te=[Se];function $e(a,s){return f(),_("div",ye,Te)}var Ee=v(ke,[["render",$e]]);const Ae={name:"NoApiKeyView"},Ce={id:"home",class:"hero-section"},Ie=$('<div class="container"><div class="row align-items-center"><div class="col-xl-6 col-lg-6 col-md-10"><div class="hero-content"><h1>Configure your ButterCMS API Token</h1><p>Please add NUXT_ENV_BUTTER_API_TOKEN to your <i>.env</i> file. Set the value as your Butter API Token.</p><a target="_blank" rel="noreferrer" href="https://buttercms.com/join/" class="main-btn btn-hover"> Get your free API token </a></div></div><div class="col-xxl-6 col-xl-6 col-lg-6"><img width="300" src="https://cdn.buttercms.com/9bPtzdJ6QSWkySNjlmyR" alt=""><div class="hero-image text-center text-lg-end"></div></div></div></div>',1),Pe=[Ie];function Ne(a,s,o,e,n,l){return f(),_("section",Ce,Pe)}var Le=v(Ae,[["render",Ne]]);const Ve={name:"ApiTokenNotFound",setup(a,{expose:s}){s(),console.error("Your Butter token might be set to an invalid value. Please verify your token is correct.");const o={};return Object.defineProperty(o,"__isScriptSetup",{enumerable:!1,value:!0}),o}};function Be(a,s,o,e,n,l){return f(),_("div")}var Oe=v(Ve,[["render",Be]]);const Fe={name:"default",setup(a,{expose:s}){s();const o=r(""),e=I(),{items:n,loading:l}=P(),{error:i}=N(),d=Y(),g=!!d.API_KEY;p(()=>{window.addEventListener("load",b),window.document.addEventListener("scroll",h,{passive:!0})}),L(()=>{window.removeEventListener("load",b),window.document.removeEventListener("scroll",h)});const h=()=>{const T=document.querySelectorAll(".page-scroll"),x=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop;for(let O of T){const w=O.getAttribute("href"),F=w==null?void 0:w.replace("/",""),k=document.querySelector(String(F)),C=x+73;k&&k.offsetTop<=C&&k.offsetTop+k.offsetHeight>C&&(o.value=String(w))}},b=async()=>{if(await V(),e.hash){const T=e.hash.slice(1);let x=document.getElementById(T);x&&x.scrollIntoView({behavior:"smooth"})}else window.scrollTo({top:0,left:0,behavior:"smooth"})};function E(){b()}B("layout",{handleMounted:E});const A={activeLink:o,route:e,items:n,loading:l,error:i,config:d,apiKeyExists:g,onScroll:h,scrollToSection:b,handleMounted:E,nextTick:V,onMounted:p,onUnmounted:L,provide:B,ref:r,useRoute:I,Header:de,Footer:me,ScrollToTop:we,Spinner:Ee,useApiError:N,useMenuItems:P,NoApiKeyView:Le,ApiTokenNotFound:Oe};return Object.defineProperty(A,"__isScriptSetup",{enumerable:!1,value:!0}),A}};function je(a,s,o,e,n,l){return f(),_("div",null,[t("div",null,[c(e.Header,{"menu-items":e.items,"active-link":e.activeLink},null,8,["menu-items","active-link"]),H(a.$slots,"default"),c(e.ScrollToTop),c(e.Footer,{"menu-items":e.items,"active-link":e.activeLink},null,8,["menu-items","active-link"])])])}var Re=v(Fe,[["render",je]]);export{Re as default};