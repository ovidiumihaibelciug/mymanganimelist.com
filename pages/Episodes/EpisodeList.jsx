import React, { Component } from 'react';
import axios from 'axios';
import { KAPI } from '../../utils';
import SimpleSchema from 'simpl-schema';
import Template from '../../components/SecondaryItems/Template';
import Loading from '../../components/Loading';

export class EpisodeList extends Component {
  state = {
    anime: '',
    loading: true,
    isFiltering: false,
    filteredItems: [],
    search: false,
  };

  componentDidMount() {
    const { slug } = this.props.match.params;

    axios
      .get('https://kitsu.io/api/edge/anime', {
        params: {
          'filter[slug]': slug,
        },
      })
      .then(({ data }) => {
        console.log(data.data);
        this.setState({
          anime: data.data[0],
          loading: false,
        });
      })
      .catch(err => console.log(err));
  }

  load = ({ filters, options }) => {
    const { anime } = this.state;
    const { id } = anime;

    let params = {
      'filter[mediaId]': id,
      'page[limit]': options.limit,
      'page[offset]': options.skip,
    };

    return axios
      .get(KAPI + '/episodes', {
        params,
      })
      .then(({ data }) => {
        return data.data;
      })
      .catch(err => console.log(err));
  };

  count = filters => {
    const { anime } = this.state;
    const { id } = anime;
    return axios
      .get(KAPI + '/episodes', {
        params: {
          'filter[mediaId]': id,
        },
      })
      .then(({ data }) => {
        return data.meta.count;
      })
      .catch(err => console.log(err));
  };

  onSubmit = (data, molecule) => {
    const { id } = this.state.anime;
    const filters = data;
    let params = {};
    let ok = 0;
    params['filter[mediaId]'] = id;
    if (filters.number) {
      params['filter[number]'] = parseInt(filters.number);
      ok = 1;
    }
    axios
      .get('https://kitsu.io/api/edge/episodes', {
        params,
      })
      .then(({ data }) => {
        if (ok) {
          this.setState({
            filteredItems: data.data,
            isFiltering: true,
          });
        }
      })
      .catch(err => console.log);
  };

  toggleFilters = () => {
    this.setState(prevState => {
      const { search } = prevState;
      return {
        search: !search,
      };
    });
  };

  stopFiltering = () => {
    this.setState({ isFiltering: false });
  };

  render() {
    let { loading } = this.state;
    if (loading) return <Loading />;
    return (
      <Template
        functions={{
          load: this.load,
          count: this.count,
          onSubmit: this.onSubmit,
          toggleFilters: this.toggleFilters,
          stopFiltering: this.stopFiltering,
        }}
        data={this.state}
        schema={FilterSchema}
      />
    );
  }
}

const FilterSchema = new SimpleSchema({
  number: {
    type: String,
    optional: true,
    easify: {
      toFilter(value) {
        return {
          number: {
            $regex: value,
            $options: 'i',
          },
        };
      },
    },
  },
});

export default EpisodeList;
