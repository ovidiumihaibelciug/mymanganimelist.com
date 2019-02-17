import React from "react";
import Link from "next/link";

const Chip = ({ item, type }) => {
  return (
    <div>
      <Link href={`/${type}/category/${item.attributes.slug}`}>
        <a className="anime__genres__chip">{item.attributes.title}</a>
      </Link>
    </div>
  );
};

export default Chip;
