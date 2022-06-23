import React from "react";

import "./FundCard.css";

const rg = /(^\w{1}|\.\s*\w{1})/gi;

const FundCard = ({ props }) => {
  const { fundname, funddescription, fundimage, default_url } = props;

  const truncateText = (text) => {
    return text.length > 200 ? text.slice(0, 200) + "..." : text;
  };

  return (
    <div className="fund-card">
      <div className="fund-image">
        <img className="fund-image" src={fundimage} alt="main campaign" />
      </div>
      <div className="fund-info">
        <div className="fund-title">{fundname}</div>
        <div className="fund-description">
          {truncateText(funddescription.replace(rg, (s) => s.toUpperCase()))}
        </div>
      </div>
    </div>
  );
};

export default FundCard;
