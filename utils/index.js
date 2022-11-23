export const basicBlogLinks = [
  {
    to: "/",
    text: "Home",
  },
  {
    to: "/blog/",
    text: "Blog",
  },
  {
    to: "/Oap",
    text: "Oap"
  },
  {
    to: "/About",
    text: "About"
  },
  {
    to: "/Program",
    text: "Program"
  }
  
];

export const formatTime = (time) => new Date(time).toLocaleString();
export const setSeo = (title, description) => {
  document.title = title;
};
