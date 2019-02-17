import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Swiper from "react-id-swiper";
import { IconChevron } from "./svg/icons";
import { getScrollbarSize } from "./functions";

class SwiperSlider extends Component {
  constructor(props) {
    super(props);
  }

  renderSlides = element => {
    if (!element) return false;
    const { className } = this.props;
    const sliderClasses = classNames("swiper-slide", `${className}__slide`);

    return <div className={sliderClasses}>{React.cloneElement(element)}</div>;
  };

  onSwiperMount = node => (this.swiperEl = node);

  renderPrevButton = () => {
    const { id } = this.props;
    const prevSlideClasses = classNames(
      "cc-swiper-button cc--prev swiper-slide-prev",
      "cc--prev" + id
    );
    return (
      <div className={prevSlideClasses}>
        <IconChevron className="cc-icon cc-icon--block" />
      </div>
    );
  };
  renderNextButton = () => {
    const { id } = this.props;
    const nextSlideClasses = classNames(
      "cc-swiper-button cc--next swiper-slide-next",
      "cc--next" + id
    );
    return (
      <div className={nextSlideClasses}>
        <IconChevron className="cc-icon cc-icon--block" />
      </div>
    );
  };

  render() {
    const {
      children,
      options,
      className,
      withPagination,
      withNav,
      withNavOutside,
      withFixedNav,
      id
    } = this.props;
    const containerClasses = classNames("swiper-container", className);

    const paginationClasses = classNames(
      "swiper-pagination",
      `${className}__pagination`,
      "swiper-pagination" + id
    );

    const navStyle = {};
    if (withFixedNav) {
      navStyle.marginRight = getScrollbarSize();
    }

    return (
      <Swiper
        renderPrevButton={this.renderPrevButton}
        renderNextButton={this.renderNextButton}
        render
        className={containerClasses}
        ref={this.onSwiperMount}
        {...options}
      >
        {React.Children.map(children, this.renderSlides)}
      </Swiper>
    );
  }
}

SwiperSlider.propTypes = {
  children: PropTypes.node,
  options: PropTypes.object,
  className: PropTypes.string,
  withNav: PropTypes.bool,
  withNavOutside: PropTypes.bool,
  withPagination: PropTypes.bool,
  withFixedNav: PropTypes.bool
};
SwiperSlider.defaultProps = {
  withPagination: true,
  withNav: false,
  withNavOutside: false,
  withFixedNav: false
};

export default SwiperSlider;
