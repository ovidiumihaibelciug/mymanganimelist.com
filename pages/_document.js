import React from "react";
import Document, { Head, Main, NextScript } from "next/document";

const GA_TRACKING_ID = "UA-135128268-1";

export default class extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage();
    return { html, head, errorHtml, chunks };
  }

  render() {
    return (
      <html>
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `
            }}
          />
          <!-- PopAds.net Popunder Code for mymanganimelist.com -->
          <
              type="text/javascript"
              data-cfasync="false"
              dangerouslySetInnerHTML={{ __html: `
                    /*<![CDATA[/* */
                    var _pop = _pop || [];
                    _pop.push(['siteId', 3405187]);
                    _pop.push(['minBid', 0]);
                    _pop.push(['popundersPerIP', 0]);
                    _pop.push(['delayBetween', 0]);
                    _pop.push(['default', false]);
                    _pop.push(['defaultPerDay', 0]);
                    _pop.push(['topmostLayer', false]);
                    (function() {
                    var pa = document.createElement('script'); pa.type = 'text/javascript'; pa.async = true;
                    var s = document.getElementsByTagName('script')[0];
                    pa.src = '//c1.popads.net/pop.js';
                    pa.onerror = function() {
                    var sa = document.createElement('script'); sa.type = 'text/javascript'; sa.async = true;
                    sa.src = '//c2.popads.net/pop.js';
                    s.parentNode.insertBefore(sa, s);
                  };
                    s.parentNode.insertBefore(pa, s);
                  })();
                  /*]]>/* */
              
              ` }}
          />
          <!-- PopAds.net Popunder Code End -->
          <script
            async
            src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          />
          <script type="text/javascript" src="//deloplen.com/apu.php?zoneid=2663999" async data-cfasync="false"></script>
            <script src="//pushlinck.com/ntfc.php?p=2509555" data-cfasync="false" async></script>
            <script type="text/javascript" src="//deloplen.com/apu.php?zoneid=2509470" async data-cfasync="false"></script>
            <script src="//pushmono.com/ntfc.php?p=2664061" data-cfasync="false" async></script>
            <script
            dangerouslySetInnerHTML={{
              __html: `
                (adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: "ca-pub-6013691979503718",
                enable_page_level_ads: true
            })
            `
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
