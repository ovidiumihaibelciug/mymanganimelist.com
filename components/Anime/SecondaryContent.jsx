import React from "react";
import AnimeContent from "./AnimeContent";

const SecondaryContent = ({ data = [], posterImage, slug }) => (
  <>
    {data.length &&
      data.map(
        ({ title, type, data }) =>
          data !== undefined &&
          data.length !== 0 && (
            <AnimeContent
              title={title}
              type={type}
              data={data}
              slug={slug}
              posterImage={posterImage}
            />
          )
      )}
  </>
);

export default SecondaryContent;
