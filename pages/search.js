import React, { Component } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../layout/Header";
import AutoForm from "uniforms-antd/AutoForm";
import SimpleSchema from "simpl-schema";
import axios from "axios";
import { KAPI } from "../utils";
import AnimeItem from "../components/Dashboard/AnimeItem";
import MangaItem from "../components/Dashboard/MangaItem";
import Loading from "../components/Loading";
import { Button } from "antd";
import "../styles/styles.scss";

class Search extends Component {
  state = {
    selected: false,
    filterText: "",
    results: [],
    loading: true,
    loadingData: false,
    type: "anime",
    skip: 0
  };

  onSubmit = data => {
    const { type } = this.state;
    axios
      .get(KAPI + `/${type}`, {
        params: {
          "page[limit]": 20,
          "filter[text]": data.string
        }
      })
      .then(({ data }) => {
        this.setState({
          results: data.data,
          filterText: data.string
        });
      })
      .catch(err => console.log(err));
  };

  handleTypeChange = e => {
    this.setState(
      {
        type: e.target.checked ? "manga" : "anime",
        loadingData: true
      },
      () => {
        this.componentDidMount();
      }
    );
  };

  componentDidMount() {
    this.load({ filters: {}, options: { limit: 20, skip: 0 } });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.load({ filters: {}, options: { limit: 20, skip: 0 } });
    this.setState({ loadingData: false });
  }

  load = ({ filters, options }, overwrite = true) => {
    const { type } = this.state;

    axios
      .get(`https://kitsu.io/api/edge/${type}`, {
        params: {
          "page[limit]": options.limit,
          "page[offset]": options.skip,
          sort: "-userCount"
        }
      })
      .then(({ data }) => {
        const { results } = this.state;

        this.setState({
          results: overwrite ? data.data : [...results, ...data.data],
          loadingData: false,
          loading: false
        });
      })
      .catch(err => console.log(err));
  };

  handleLoadMore = () => {
    const { skip } = this.state;

    this.load({ filters: {}, options: { limit: 20, skip: skip + 20 } }, false);
    this.setState({ skip: skip + 20 });
  };

  count = filters => {
    return axios
      .get(KAPI + "/anime", {
        params: {
          "page[limit]": 20,
          "page[offset]": 1,
          sort: "-userCount"
        }
      })
      .then(({ data }) => {
        return 1000;
      })
      .catch(err => console.log(err));
  };

  render() {
    const { results, selected, type, loading, loadingData } = this.state;

    if (loading) return <Loading />;

    return (
      <section className="o-main-layout">
        <Sidebar />
        <section className="o-main o-dashboard">
          <Header isFixed />
          <div className="main-content">
            <div className="o-search__form">
              <AutoForm
                onChange={(name, value) => console.log(name, value)}
                onSubmit={this.onSubmit}
                schema={SearchSchema}
                autoComplete="off"
              />
              <label htmlFor="toggle1" className="toggle-1">
                <input
                  type="checkbox"
                  id="toggle1"
                  className="toggle-1__input"
                  onChange={this.handleTypeChange}
                />
                <span className="toggle-1__button" />
              </label>
            </div>
            <div className="main-content anime-view anime-container anime-episodes items">
              <div className="easy-list-wrapper">
                {!loadingData ? (
                  results.map(item => {
                    return type === "anime" ? (
                      <AnimeItem item={item} />
                    ) : (
                      <MangaItem item={item} />
                    );
                  })
                ) : (
                  <Loading />
                )}
              </div>
              <div className="custom-btn">
                <Button type="primary" ghost onClick={this.handleLoadMore}>
                  Load More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </section>
    );
  }
}

const SearchSchema = new SimpleSchema({
  string: {
    type: String,
    optional: true
  }
});

export default Search;
