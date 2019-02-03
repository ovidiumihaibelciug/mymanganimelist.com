import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../layout/Header';
import { KAPI } from '../../utils';
import axios from 'axios';
import RightSidebar from '../../components/RightSidebar';
import Loading from '../../components/Loading';
import moment from 'moment';
import UserPosts from '../../components/User/UserPosts';
import FavoriteItems from '../../components/User/FavoriteItems';

class UserView extends React.Component {
  state = {
    user: {},
    loading: true,
  };

  componentDidMount() {
    const { id } = this.props.match.params;

    // then(({data}) => {
    //   this.setState({
    //     user: data.data[0],
    //     loading: false
    //   });
    // })
    //   .catch(err => console.log(err));

    axios
      .all([
        axios.get(KAPI + '/users/', {
          params: {
            'filter[id]': id,
            include:
              'reviews,pinnedPost,blocks,stats,quotes,favorites,favorites.item,waifu,profileLinks,categoryFavorites.category,libraryEntries',
          },
        }),
        axios.get(
          `https://kitsu.io/api/edge/feeds/user_aggr/${id}?filter[kind]=posts&include=media,actor,unit,subject,target,target.user,target.target_user,target.spoiled_unit,target.media,target.target_group,target.uploads,subject.user,subject.target_user,subject.spoiled_unit,subject.media,subject.target_group,subject.uploads,subject.followed,subject.library_entry,subject.anime,subject.manga`,
        ),
      ])
      .then(([userData, userFeed]) => {
        console.log('userData', userData);
        const user = userData.data.data[0];
        const favorites = userData.data.included
          .filter(item => item.type === 'favorites')
          .map(item => {
            return {
              type: item.relationships.item.data.type,
              id: item.relationships.item.data.id,
              item: userData.data.included.find(
                favItem =>
                  favItem.id === item.relationships.item.data.id &&
                  item.relationships.item.data.type === favItem.type,
              ),
            };
          });
        console.log(favorites);
        const posts =
          userFeed.data.included &&
          userFeed.data.included.filter(item => item.type === 'posts');
        const follows =
          userFeed.data.included &&
          userFeed.data.included.filter(item => item.type === 'follows');
        const comments =
          userFeed.data.included &&
          userFeed.data.included.filter(item => item.type === 'comments');
        const uploads =
          userFeed.data.included &&
          userFeed.data.included.filter(item => item.type === 'uploads');
        const activities =
          userFeed.data.included &&
          userFeed.data.included.filter(item => item.type === 'activities');
        const users =
          userFeed.data.included &&
          userFeed.data.included.filter(item => item.type === 'users');
        const media =
          userFeed.data.included &&
          userFeed.data.included.filter(
            item => item.type === 'anime' || item.type === 'manga',
          );
        const episodes =
          userFeed.data.included &&
          userFeed.data.included.filter(item => item.type === 'episodes');

        this.setState({
          posts,
          follows,
          comments,
          uploads,
          activities,
          users,
          user,
          media,
          episodes,
          favorites,
          loading: false,
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const {
      user,
      posts = [],
      uploads = [],
      media = [],
      episodes = [],
      comments,
      favorites,
      loading,
    } = this.state;
    if (loading) {
      return <Loading />;
    }

    const favoritesAnime = favorites.filter(item => item.type === 'anime');
    const favoritesManga = favorites.filter(item => item.type === 'manga');
    const favoritesCharacters = favorites.filter(
      item => item.type === 'characters',
    );

    let {
      coverImage,
      avatar,
      name,
      about,
      gender,
      location,
      birthday,
      createdAt,
    } = user.attributes;

    if (!coverImage) {
      coverImage = {
        original:
          'https://atiinc.org/wp-content/uploads/2017/01/cover-default.jpg',
      };
    }

    return (
      <>
        <section className="anime-view o-main-layout">
          <Sidebar small={true} />
          <div
            className="o-main o-anime-view o-episode-view"
            style={{
              backgroundImage: `linear-gradient(15deg,rgba(20, 28, 36, 1) 10%, rgba(30, 34, 38, 0.99) 40%,  rgba(30, 34, 38, 0.95) 100%) , url(${
                coverImage.original
              })`,
            }}
          >
            <Header />
            <div className="anime">
              <div className="anime-container">
                <div className="anime__info">
                  <div className="anime__info__title-area">
                    <div className="anime__info__title">{name}</div>
                  </div>
                  <div className="anime__rating">
                    <div className="anime__rating__text">
                      <i className="fa fa-user" /> {gender}
                    </div>
                    <br />
                    <div className="anime__rating__text">
                      <i className="fa fa-location-arrow" /> {location}
                    </div>
                    <div className="anime__rating__text">
                      <i className="fa fa-birthday-cake" />{' '}
                      {moment(birthday).format('MMM Do YYYY')}
                    </div>
                    <div className="anime__rating__text">
                      <i className="fa fa-calendar" />{' '}
                      {moment(createdAt).format('MMM Do YYYY')}
                    </div>
                  </div>
                  <div className="anime__description">
                    {about ? about : "About Me: That's a secret"}
                  </div>
                  <div className="anime__details" />
                </div>
              </div>
            </div>
            <RightSidebar
              coverImage={coverImage}
              posterImage={avatar}
              status={status}
              user={user}
              isUser
              // nextRelease={nextRelease}
            />
          </div>
          <div className="secondary">
            <FavoriteItems
              anime={favoritesAnime}
              manga={favoritesManga}
              characters={favoritesCharacters}
            />

            <UserPosts
              className="o-posts"
              posts={posts}
              user={user}
              uploads={uploads}
              episodes={episodes}
              comments={comments}
            />
          </div>
        </section>
      </>
    );
  }
}

export default UserView;
