import{_ as p,s as g,o as n,c,a as t,b as _,w as u,g as N,p as C,d as V,f as v,L as D,M as O,N as z,O as M,P as W,Q as q,R as G,S as Q,T as U,U as X,e as x,h as J,i as A,t as f,F as y,j as w,k as I,V as K,G as B,m as Y,C as P,l as j,q as Z,W as tt,X as et}from"./entry-48a504ae.mjs";import{u as st}from"./asyncData-1a9541bb.mjs";import{S as at}from"./Seo-22a2ba4a.mjs";import{B as ot}from"./BlogWidget-603d3245.mjs";const it={name:"HeroSection",props:["fields"],setup(a,{expose:d}){d();const e=a;g(()=>{var l=0;r();function r(){var s,i=document.getElementsByClassName("mySlides");for(s=0;s<i.length;s++)i[s].style.display="none";l++,l>i.length&&(l=1),i[l-1].style.display="block",setTimeout(r,9e3)}});const o={props:e};return Object.defineProperty(o,"__isScriptSetup",{enumerable:!1,value:!0}),o}},T=a=>(C("data-v-7b834702"),a=a(),V(),a),nt={class:"body"},dt={class:"hero"},lt={class:"hero-article"},ct=N('<div class="hero-text" data-v-7b834702><h1 class="lg-text" data-v-7b834702>Relax and Enjoy the<br data-v-7b834702> <span class="colored-text" data-v-7b834702> Best FM </span> on the<br data-v-7b834702> planet earth...</h1><h1 class="mobile-text" data-v-7b834702>Relax and Enjoy the <span class="colored-text" data-v-7b834702> Best FM </span> on the planet earth...</h1></div><div class="hero-para" data-v-7b834702><p data-v-7b834702>Listen to exciting talks about sport, recent<br data-v-7b834702> news, dramas, relationships and many more on<br data-v-7b834702> sparkling FM</p></div>',2),rt={class:"hero-links"},_t=T(()=>t("a",{style:{"background-color":"rgba(229, 137, 70, 1)"},href:"#C4",class:"listen nuxt-link-exact-active",id:"listen"},"Listen Live",-1)),mt=v("Read our Articles"),ht=N('<div class="hero-img" data-v-7b834702><div class="w3-content w3-section" style="max-width:500px;" data-v-7b834702><div class="mySlides slideshow-container" data-v-7b834702><img src="'+D+'" style="width:100%;" data-v-7b834702><h1 class="numbertext" data-v-7b834702>1 / 10</h1></div><div class="mySlides slideshow-container" data-v-7b834702><img src="'+O+'" style="width:100%;" data-v-7b834702><h1 class="numbertext" data-v-7b834702>2 / 10</h1></div><div class="mySlides slideshow-container" data-v-7b834702><img src="'+z+'" style="width:100%;" data-v-7b834702><h1 class="numbertext" data-v-7b834702>3 / 10</h1></div><div class="mySlides slideshow-container" data-v-7b834702><img src="'+M+'" style="width:100%;" data-v-7b834702><h1 class="numbertext" data-v-7b834702>4 / 10</h1></div><div class="mySlides slideshow-container" data-v-7b834702><img src="'+W+'" style="width:100%;" data-v-7b834702><h1 class="numbertext" data-v-7b834702>5 / 10</h1></div><div class="mySlides slideshow-container" data-v-7b834702><img src="'+q+'" style="width:100%;" data-v-7b834702><h1 class="numbertext" data-v-7b834702>6 / 10</h1></div><div class="mySlides slideshow-container" data-v-7b834702><img src="'+G+'" style="width:100%;" data-v-7b834702><h1 class="numbertext" data-v-7b834702>7 / 10</h1></div><div class="mySlides slideshow-container" data-v-7b834702><img src="'+Q+'" style="width:100%;" data-v-7b834702><h1 class="numbertext" data-v-7b834702>8 / 10</h1></div><div class="mySlides slideshow-container" data-v-7b834702><img src="'+U+'" style="width:100%;" data-v-7b834702><h1 class="numbertext" data-v-7b834702>9 / 10</h1></div><div class="mySlides slideshow-container" data-v-7b834702><img src="'+X+'" style="width:100%;" data-v-7b834702><h1 class="numbertext" data-v-7b834702>10 / 10</h1></div></div></div>',1),ut=T(()=>t("div",{class:"iframe",id:"C4"},[t("div",null,[t("iframe",{loading:"lazy",src:"https://mixlr.com/users/2614208/embed",width:"100%",height:"180px",frameborder:"no",marginwidth:"0",marginheight:"0",scrolling:"no"})])],-1));function vt(a,d,e,o,l,r){const s=x;return n(),c("div",nt,[t("div",dt,[t("div",lt,[ct,t("div",rt,[_t,_(s,{class:"second-link",to:"/blog/"},{default:u(()=>[mt]),_:1})])]),ht]),ut])}var pt=p(it,[["render",vt],["__scopeId","data-v-7b834702"]]);const bt={},gt={},ft={name:"BlogPostTile",props:["featured_image","featured_image_alt","slug","title","summary"],setup(a,{expose:d}){d();const e={};return Object.defineProperty(e,"__isScriptSetup",{enumerable:!1,value:!0}),e}},yt={class:"col-lg-4 col-md-8 col-sm-10"},wt={class:"single-blog"},xt={key:0,class:"blog-header"},St=["src","alt"],$t={class:"blog-body"},kt={class:"package-name"},Bt={class:"blog-footer"},Pt=v("Read More");function jt(a,d,e,o,l,r){const s=J("router-link");return n(),c("div",yt,[t("div",wt,[e.featured_image?(n(),c("div",xt,[t("img",{class:"img-fluid",loading:"lazy",src:e.featured_image,alt:e.featured_image_alt},null,8,St)])):A("",!0),t("div",$t,[t("h5",kt,[_(s,{to:`/blog/${e.slug}/`},{default:u(()=>[v(f(e.title),1)]),_:1},8,["to"])]),t("p",null,f(e.summary),1)]),t("div",Bt,[_(s,{to:`/blog/${e.slug}/`,class:"main-btn btn-hover"},{default:u(()=>[Pt]),_:1},8,["to"])])])])}var Nt=p(ft,[["render",jt]]);const Ct={name:"BlogSection",props:["blogPosts"],setup(a,{expose:d}){d();const e={BlogPostTile:Nt};return Object.defineProperty(e,"__isScriptSetup",{enumerable:!1,value:!0}),e}},Vt={id:"blog",class:"blog-section"},At={class:"container"},It=t("div",{class:"row justify-content-center"},[t("div",{class:"col-lg-6 col-md-10"},[t("div",{class:"section-title text-center"},[t("h2",null,"Latest News"),t("p")])])],-1),Tt={class:"row justify-content-center"},Et=v(" View All News ");function Ft(a,d,e,o,l,r){const s=x;return n(),c("section",Vt,[t("div",At,[It,t("div",Tt,[(n(!0),c(y,null,w(e.blogPosts,(i,m)=>(n(),I(o.BlogPostTile,K({key:m},i),null,16))),128))]),t("p",null,[_(s,{class:"main-btn btn-hover mt-5",to:"/blog/"},{default:u(()=>[Et]),_:1})])])])}var Ht=p(Ct,[["render",Ft]]);const Lt={},Rt={name:"HomeView",props:["slug"],async setup(a,{expose:d}){d();let e,o;const l=a,{categories:r}=B(),{$butterCMS:s}=Y(),{setError:i}=P(),{handleMounted:m}=j("layout"),{data:F,refresh:S}=([e,o]=Z(async()=>st("home-data",async()=>{var k;const H=(k=l.slug)!=null?k:"landing-page-with-components";try{const h=await(s==null?void 0:s.page.retrieve("landing-page",H)),L=h==null?void 0:h.data.data,b=await(s==null?void 0:s.post.list({page:1,page_size:3})),R=b==null?void 0:b.data.data;return{pageData:L,blogPosts:R}}catch(h){return i(h),null}})),e=await e,o(),e);g(S);const $={categories:r,$butterCMS:s,setError:i,handleMounted:m,props:l,data:F,refresh:S,inject:j,onMounted:g,HeroSection:pt,TwoColumnWithImageSection:bt,FeaturesSection:gt,BlogSection:Ht,TestimonialsSection:Lt,useApiError:P,Seo:at,BlogWidget:ot,useCategories:B};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}},E=a=>(C("data-v-2c8d904c"),a=a(),V(),a),Dt={class:"category"},Ot={class:"widget categories-widget"},zt=E(()=>t("h5",{class:"widget-title"},"Categories",-1)),Mt={class:"categories-list"},Wt=E(()=>t("div",{class:"download"},[t("a",{href:"../assets/files/advert.pdf",download:"Advert"},"Advertisments? Click here ->")],-1));function qt(a,d,e,o,l,r){const s=x;return n(),c("div",null,[_(o.Seo,tt(et(o.data.pageData.fields.seo)),null,16),(n(!0),c(y,null,w(o.data.pageData.fields.body,(i,m)=>(n(),c("div",null,[i.type==="hero"?(n(),I(o.HeroSection,{key:m,fields:i.fields},null,8,["fields"])):A("",!0)]))),256)),_(o.BlogSection,{"blog-posts":o.data.blogPosts},null,8,["blog-posts"]),t("section",Dt,[t("div",Ot,[zt,t("ul",Mt,[(n(!0),c(y,null,w(o.categories,i=>(n(),c("li",{key:i.slug},[_(s,{to:`/blog/category/${i.slug}/`},{default:u(()=>[v(f(i.name),1)]),_:2},1032,["to"])]))),128))])])]),Wt])}var Jt=p(Rt,[["render",qt],["__scopeId","data-v-2c8d904c"]]);export{Jt as H};
