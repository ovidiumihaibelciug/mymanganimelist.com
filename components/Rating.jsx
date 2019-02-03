import React, { Component } from 'react';

export default class Rating extends Component {
  state = {
    stars: [],
  };

  renderStars = stars => {
    let negativeStars = 5 - stars;
    let starComps = [];
    while (stars) {
      let star = {
        classN: 'anime__rating__star-block anime__rating__star-block--positive',
      };
      starComps = [...starComps, star];
      stars--;
    }
    while (negativeStars) {
      let star = {
        classN: 'anime__rating__star-block anime__rating__star-block--negativ',
      };
      starComps = [...starComps, star];
      negativeStars--;
    }
    this.setState({
      stars: starComps,
    });
  };

  componentDidMount() {
    const { starsCount } = this.props;
    this.renderStars(starsCount);
  }

  render() {
    const { stars } = this.state;
    return (
      <div>
        {stars.map(star => {
          return (
            <span className={star.classN}>
              <i className="fa fa-star" />
            </span>
          );
        })}
      </div>
    );
  }
}
