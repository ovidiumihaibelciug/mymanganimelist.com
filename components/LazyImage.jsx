import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class LazyImage extends PureComponent {
  constructor(props) {
    super(props);
  }

  getImagePlaceholder = () => {
    const { width, height } = this.props;
    const svgPlaceholder = `<svg xmlns='http://www.w3.org/2000/svg' width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"/>`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      svgPlaceholder,
    )}`;
  };

  render() {
    const { className, src, width, height, srcSet = '', ...rest } = this.props;
    const imagePlaceholder = this.getImagePlaceholder();

    const classes = classNames('cc-img', className);

    return (
      <figure className={classes}>
        <div className="swiper-lazy-preloader cc-img__overlay">
          <div className="cc-spinner" />
        </div>
        <img
          className="swiper-lazy"
          src={imagePlaceholder}
          data-src={src}
          data-srcset={srcSet}
          width={width}
          height={height}
          {...rest}
        />
      </figure>
    );
  }
}

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
};

export default LazyImage;
