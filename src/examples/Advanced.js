import React, { useState, useMemo, useRef } from "react";
// import TinderCard from '../react-tinder-card/index'
import TinderCard from "react-tinder-card";
import FundCard from "../FundCard/FundCard";

import { db } from "./db";

function Advanced() {
  const [currentIndex, setCurrentIndex] = useState(db.length - 1);
  const [lastDirection, setLastDirection] = useState();
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < db.length - 1;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  const donate = () => {
    window.open(db[currentIndex].fundurl);
    swipe("right");
  };

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css?family=Damion&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Alatsi&display=swap"
        rel="stylesheet"
      />
      <div className="cardContainer">
        {db.map((campaign, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={campaign.fundname}
            onSwipe={(dir) => swiped(dir, campaign.fundname, index)}
            onCardLeftScreen={() => outOfFrame(campaign.fundname, index)}
          >
            <FundCard props={campaign} />
          </TinderCard>
        ))}
      </div>
      <div className="buttons">
        <button
          style={{ backgroundColor: !canSwipe && "#fbf8f6" }}
          onClick={() => swipe("left")}
        >
          <img src="./img/skip.png" alt="skip this campaign" />
        </button>
        <button
          className="donate"
          style={{ backgroundColor: !canSwipe && "#fbf8f6" }}
          onClick={() => donate()}
        >
          <img src="./img/donate.png" alt="donate to this campaign" />
        </button>
        <button
          style={{ backgroundColor: !canSwipe && "#fbf8f6" }}
          onClick={() => swipe("right")}
        >
          <img src="./img/heart.png" alt="like this campaign" />
        </button>
      </div>
    </div>
  );
}

export default Advanced;
