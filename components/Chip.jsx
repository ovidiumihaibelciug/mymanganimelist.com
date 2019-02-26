import React from "react";
import Link from "next/link";

const Chip = ({ item, type, noLink = false }) => {
  if (noLink) {
    return <div className="anime__genres__chip">{item.attributes.title}</div>;
  }
  return (
    <h2>
      <Link href={`/${type}/category/${item.attributes.slug}`}>
        <a className="anime__genres__chip">{item.attributes.title}</a>
      </Link>
    </h2>
  );
};

export default Chip;
