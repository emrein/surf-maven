import "./HeroSection.css";
import React, { useState } from "react";
import image from "../images/surf1.svg";


export const HeroSection = () => {
  return (
    <div className="row">
      <div className="col left">
        <h1 style={{ marginLeft: '50px' }}>User Behavior Analytics</h1>
        <p style={{ marginLeft: '50px' }}>
          Please click to "Edit Behaviors" link to add or change behavior definitions...
        </p>
      </div>
      <div className="col right">
        <img src={image} alt="" />
      </div>
    </div>
  );
};


