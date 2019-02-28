import React from "react";
import Head from "next/head";
import { string } from "prop-types";
import "../styles/styles.scss";

const defaultDescription = "";
const defaultOGURL = "";
const defaultOGImage = "";

const NextHead = props => (
  <>
    <Head>
      <meta charSet="UTF-8" />
      <title>{props.title || ""}</title>
      <meta
        name="description"
        content={props.description || defaultDescription}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        rel="icon"
        sizes="192x192"
        href="https://fonts.googleapis.com/css?family=Roboto"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Poppins"
        rel="stylesheet"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="../static/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="../static/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="../static/favicon-16x16.png"
      />
      <link rel="manifest" href="../static/site.webmanifest" />
      <link
        rel="mask-icon"
        href="../static/safari-pinned-tab.svg"
        color="#5bbad5"
      />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
      <meta property="og:url" content={props.url || defaultOGURL} />
      <meta property="og:title" content={props.title || ""} />
      <meta
        property="og:description"
        content={props.description || defaultDescription}
      />
      <meta name="twitter:site" content={props.url || defaultOGURL} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={props.ogImage || defaultOGImage} />
      <meta property="og:image" content={props.ogImage || defaultOGImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
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
    <noscript
      dangerouslySetInnerHTML={{
        __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MPWGTK4"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`
      }}
    />
  </>
);

Head.propTypes = {
  title: string,
  description: string,
  url: string,
  ogImage: string
};

export default NextHead;
