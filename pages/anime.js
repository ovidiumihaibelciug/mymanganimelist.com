import React, { Component } from 'react';
import axios from 'axios';
import { KAPI } from '../utils';
import ItemView from '../components/ItemView';
import '../styles/styles.scss';

export default class Anime extends Component {

  static getInitialProps ({ query: { slug } }) {
    return { slug }
  }

  state = {
    anime: '',
    genres: [],
    episodes: [],
    characters: [],
    franchises: [],
    loading: true,
    isOpen: false,
  };

  componentWillReceiveProps(nextProps) {
    this.getAnime(nextProps);
  }

  componentDidMount() {
    this.getAnime(this.props);
  }

  getAnime = props => {
    const { slug } = props;
    axios
      .get(KAPI + '/anime', {
        params: {
          'filter[slug]': slug,
          include: 'genres,categories,mediaRelationships.destination',
        },
      })
      .then(({ data }) => {
        console.log(data);
        const categories = data.included.filter(
          item => item.type === 'categories',
        );
        const franchises = data.included.filter(
          item => item.type === 'manga' || item.type === 'anime',
        );
        this.setState({
          anime: data.data[0],
          categories,
          franchises,
        });
        axios
          .get(KAPI + '/episodes', {
            params: {
              'filter[mediaId]': data.data[0].id,
              'page[limit]': 8,
              'page[offset]': 0,
            },
          })
          .then(({ data }) => {
            this.setState({
              episodes: data.data,
            });
          })
          .catch(err => console.log(err));
        axios
          .get(KAPI + '/anime-characters', {
            params: {
              'filter[animeId]': data.data[0].id,
              'page[limit]': 8,
              include: 'character',
            },
          })
          .then(({ data }) => {
            this.setState({
              characters: data.included,
              loading: false,
            });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  };

  render() {
    return <ItemView data={this.state} />;
  }
}
