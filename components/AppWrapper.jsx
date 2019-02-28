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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MPWGTK4');`
          }}
        />
      </Head>
      <div>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MPWGTK4"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`
          }}
        />
        {children}
      </div>
    </div>
  );
};

export default AppWrapper;
