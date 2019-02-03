import React, { Component, Fragment } from 'react';

export default class MediaModal extends Component {
  state = {
    active: false,
  };

  componentDidMount() {
    this.setState({
      active: this.props.active,
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      active: nextProps.active,
    });
  }

  render() {
    const { active } = this.state;
    return (
      <Fragment>
        <div className="final__modal">
          <div className="final__modal__content">
            <h3>Heading Title</h3>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </p>
            <label htmlFor="final__click" className="final__button">
              <a className="button-theme">Close</a>
            </label>
          </div>
        </div>
        <div className="final__overlay" />
      </Fragment>
    );
  }
}
