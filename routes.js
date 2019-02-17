const routes = require("next-routes");

module.exports = routes()
  .add({
    name: "dashboard",
    pattern: "/dashboard",
    page: "dashboard"
  })
  .add({
    name: "animeCategory",
    pattern: "/anime/category/:category",
    page: "/anime/category"
  })
  .add({
    name: "animeListType",
    pattern: "/anime/list/:type",
    page: "/anime/list"
  })
  .add({
    name: "anime",
    pattern: "/anime",
    page: "/dashboard"
  })
  .add({
    name: "animeSlug",
    pattern: "/anime/:slug",
    page: "/anime"
  })
  .add({
    name: "mangaViewSlug",
    pattern: "/manga/:slug",
    page: "/manga/view"
  })
  .add({
    name: "mangaView",
    pattern: "/manga/view/:slug",
    page: "/manga/view"
  })
  .add({
    name: "mangaCategory",
    pattern: "/manga/category/:category",
    page: "/manga/category"
  })
  .add({
    name: "mangaListType",
    pattern: "/manga/list/:type",
    page: "/manga/list"
  })
  .add({
    name: "episodesListSlug",
    pattern: "/anime/:slug/episodes",
    page: "/episodes/list"
  })
  .add({
    name: "episodeSlugNumber",
    pattern: "/anime/:slug/episodes/:number",
    page: "/episode"
  })
  .add({
    name: "charactersAnimeList",
    pattern: "/anime/:slug/characters",
    page: "/characters/anime/list"
  })
  .add({
    name: "charactersMangaList",
    pattern: "/manga/:slug/characters",
    page: "/characters/manga/list"
  })
  .add({
    name: "charactersViewSlug",
    pattern: "/characters/view/:slug",
    page: "/characters/view"
  })
  .add({
    name: "characters",
    pattern: "/characters",
    page: "/characters/list"
  })
  .add({
    name: "search",
    pattern: "/search",
    page: "/search"
  })
  .add({
    name: "discussions",
    pattern: "/discussions",
    page: "/feed"
  })
  .add({
    name: "feed",
    pattern: "/feed",
    page: "/discussions"
  })
  .add({
    name: "chaptersSlug",
    pattern: "/manga/:slug/chapters/:number",
    page: "/chapters/view"
  })
  .add({
    name: "myAccount",
    pattern: "/my-account",
    page: "/user/my-account"
  })
  .add({
    name: "userAccount",
    pattern: "/user/:id",
    page: "/user/view"
  })
  .add({
    name: "usersAccount",
    pattern: "/users/:id",
    page: "/user/view"
  })
  .add({
    name: "login",
    pattern: "/login",
    page: "/login"
  });
