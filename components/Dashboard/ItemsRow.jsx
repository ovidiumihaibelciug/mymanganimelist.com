import React from 'react';
import Swiper from '../Swiper';
import Link from 'next/link'


const moveRight = e => {
  const scrollBar = e.target.parentElement.parentElement.children[2];
  scrollBar.scrollBy({
    left: 200,
    behavior: 'smooth',
  });
};

const moveLeft = e => {
  const scrollBar = e.target.parentElement.parentElement.children[2];

  scrollBar.scrollBy({
    left: -200,
    behavior: 'smooth',
  });
};

const ItemsRow = ({ id, title, url, children }) => {
  const params = {
    speed: 800,
    loop: true,
    centeredSlides: true,
    slidesPerView: 8,
    slidesPerGroup: 3,
    watchOverflow: true,
    loopAdditionalSlides: 0,
    spaceBetween: 0,
    slidePrevClass: 'swiper-slide-prev swiper-slide-prev' + id,
    slideNextClass: 'swiper-slide-next swiper-slide-next' + id,
    navigation: {
      nextEl: '.cc-swiper-button.cc--next.swiper-slide-next.cc--next' + id,
      prevEl: '.cc-swiper-button.cc--prev.swiper-slide-prev.cc--prev' + id,
    },
    effect: 'slide',
    breakpoints: {
      400: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      800: {
        slidesPerView: 2,
        spaceBetween: 0,
      },
      1200: {
        slidesPerView: 'auto',
        spaceBetween: 0,
      },
    },
    a11y: {
      enabled: false,
    },
    pagination: {
      el: `.swiper-pagination${id}`,
      clickable: true,
    },
    runCallbacksOnInit: true,
  };

  return (
    <div className="items-row">
      <div className="text-row">
        <div className="title">{title}</div>
        {url && (
          <Link to={url}>
            <a className="view-more">
              View more
            </a>
          </Link>
        )}
      </div>
      <div className="items">
        <Swiper id={id} options={params}>
          {children}
        </Swiper>
      </div>
    </div>
  );
};

export default ItemsRow;
