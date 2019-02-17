import React from "react";
import Head from "next/head";
import "../styles/styles.scss";

const AppWrapper = ({ title, children }) => {
  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta
          name="description"
          content="This is a meta description sample. We can add up to 160 characters."
        />

        <meta name="robots" content="index, follow" />

        <meta name="keywords" content="HTML,CSS,XML,JavaScript" />

        <meta name="author" content="John Doe" />

        <meta property="og:type" content="article" />

        <meta property="og:title" content="TITLE OF YOUR POST OR PAGE" />

        <meta property="og:description" content="DESCRIPTION OF PAGE CONTENT" />

        <meta property="og:image" content="LINK TO THE IMAGE FILE" />

        <meta property="og:url" content="PERMALINK" />

        <meta property="og:site_name" content="SITE NAME" />
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
