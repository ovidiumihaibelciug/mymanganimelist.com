import React from "react";
import Head from "next/head";
import "../styles/styles.scss";
import { Router } from "../routes";

import * as gtag from "../lib/gtag";

Router.events.on("routeChangeComplete", url => gtag.pageview(url));

const AppWrapper = ({ title, description, keywords, children }) => {
  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta name="robots" content="index, follow" />

        <meta name="keywords" content={keywords} />

        <meta name="author" content="MyMangaAnimeList" />

        <meta property="og:type" content="article" />

        <meta property="og:title" content={title} />

        <meta property="og:description" content={description} />

        <meta property="og:image" content={"logo"} />

        <meta property="og:url" content="PERMALINK" />

        <meta property="og:site_name" content="mymanganimelist.com" />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.7.1/css/all.css"
        />
      </Head>
      <div>{children}</div>
    </div>
  );
};

export default AppWrapper;
