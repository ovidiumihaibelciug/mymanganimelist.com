import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../layout/Header';
import { KAPI } from '../../utils';
import axios from 'axios';
import RightSidebar from '../../components/RightSidebar';
import Loading from '../../components/Loading';
import moment from 'moment';
import FavoriteItems from '../../components/User/FavoriteItems';
import UserPosts from '../../components/User/UserPosts';

class MyAccount extends React.Component {
  state = {
    user: {},
    loading: true,
  };

  componentDidMount() {
    const userStore = JSON.parse(localStorage.getItem('user'));

    axios
      .get(
        KAPI +
          '/users?filter%5Bself%5D=true&include=profileLinks.profileLinkSite%2Cfavorites.item%2CpinnedPost.user%2CpinnedPost.targetUser%2CpinnedPost.spoiledUnit%2CpinnedPost.media%2CpinnedPost.targetGroup%2CpinnedPost.uploads%2Cstats',
        {
          headers: {
            Authorization: 'Bearer ' + userStore.data.access_token,
          },
        },
      )
      .then(userData => {
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
        axios
          .get(
            `https://kitsu.io/api/edge/feeds/user_aggr/${
              user.id
            }?filter[kind]=posts&include=media,actor,unit,subject,target,target.comments,target.comments.user,target.user,target.target_user,target.spoiled_unit,target.media,target.target_group,target.uploads,subject.user,subject.target_user,subject.spoiled_unit,subject.media,subject.target_group,subject.uploads,subject.followed,subject.library_entry,subject.anime,subject.manga`,
          )
          .then(userFeed => {
            console.log(userFeed);
            const follows =
              userFeed.data.included &&
              userFeed.data.included.filter(item => item.type === 'follows');
            const users =
              userFeed.data.included &&
              userFeed.data.included.filter(item => item.type === 'users');
            const comments =
              userFeed.data.included &&
              userFeed.data.included
                .filter(item => item.type === 'comments')
                .map(item => {
                  const { id: userId, type } = item.relationships.user.data;
                  const user = users.find(
                    item => item.id === userId && item.type === type,
                  );
                  item.user = user;

                  return item;
                });
            console.log(comments);
            const posts = userFeed.data.included
              .filter(item => item.type === 'posts')
              .map(post => {
                const { id: userId } = post.relationships.user.data;
                const { data } = post.relationships.comments;

                const commentsIds = data.map(item => item.id);
                console.log(commentsIds);

                post.user = users.find(user => user.id === userId);
                post.comments = comments.filter(item =>
                  commentsIds.includes(item.id),
                );

                console.log(post.comments);

                return post;
              });

            const uploads =
              userFeed.data.included &&
              userFeed.data.included.filter(item => item.type === 'uploads');
            const activities =
              userFeed.data.included &&
              userFeed.data.included.filter(item => item.type === 'activities');
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
              media,
              episodes,
              user,
              favorites,
              loading: false,
            });
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
      favorites,
      comments,
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
      avatar = {
        original: 'https://i.ytimg.com/vi/qwzQPh7dW_4/maxresdefault.jpg',
      },
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
              backgroundImage: `linear-gradient(15deg,rgba(20, 28, 36, 1) 10%, rgba(30, 34, 38, 0.99) 40%,  rgba(30, 34, 38, 0.95) 100%) , url(${coverImage.original ||
                'https://i.ytimg.com/vi/qwzQPh7dW_4/maxresdefault.jpg'})`,
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
              posterImage={
                avatar || {
                  original:
                    'https://i.ytimg.com/vi/qwzQPh7dW_4/maxresdefault.jpg',
                }
              }
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
            />
          </div>
        </section>
      </>
    );
  }
}

export default MyAccount;
