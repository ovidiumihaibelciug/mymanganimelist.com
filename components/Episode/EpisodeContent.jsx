import React from "react";
import Chip from "../Chip";
import moment from "moment";
import { Icon } from "antd";

const EpisodeContent = ({
  thumbnail,
  chipItem,
  canonicalTitle,
  length,
  synopsis,
  airdate
}) => {
  return (
    <div className="anime-container episode-container">
      <div className="secondary-item">
        <div
          className="secondary-item__leftside"
          style={{ backgroundImage: `url("${thumbnail.original}")` }}
        />
        <div className="secondary-item__rightside">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Chip item={chipItem} noLink />
          </div>
          <div className="secondary-item__rightside__title">
            {canonicalTitle}
          </div>
          <div className="secondary-item__rightside__description">
            {synopsis}
          </div>
          <div className="secondary-item__rightside__date">
            <Icon type="clock-circle" theme="outlined" />
            &nbsp;&nbsp;
            {length} minutes
          </div>
          <div className="secondary-item__rightside__date">
            <Icon type="calendar" theme="outlined" />
            &nbsp;&nbsp;
            {moment(airdate).format("MMMM Do YYYY")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeContent;
