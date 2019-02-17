import React from "react";
import SimpleSchema from "simpl-schema";
import { AutoForm, AutoField, ErrorField } from "uniforms-antd";
import Button from "antd/lib/button";
import notification from "antd/lib/notification";
import ModalVideo from "react-modal-video";
import Sidebar from "../../components/Sidebar";
import Header from "../../layout/Header";
import Rating from "../../components/Rating";
import Chip from "../../components/Chip";
import AnimeContent from "../../components/Anime/AnimeContent";
import RightSidebar from "../../components/RightSidebar";

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <section className="anime-view o-main-layout">
          <Sidebar small={true} />
          <div className="o-main o-anime-view">
            <Header />
            <div className="anime" />
            {/*<RightSidebar*/}
            {/*coverImage={posterImage}*/}
            {/*posterImage={thumbnail}*/}
            {/*status={status}*/}
            {/*// nextRelease={nextRelease}*/}
            {/*/>*/}
          </div>
        </section>
      </>
    );
  }
}

export default Profile;
