import React from "react";
import "./About.css";
import "react-bootstrap";

const About = () => {
  return <>
    <div className="about-container">

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ backgroundColor: '#E2E8F0', padding: '20px', maxWidth: '500px', textAlign: 'center', marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>Developer</h4>
          <p>Emre Inal, University of Manchester (2022-2023)</p>
        </div>

        <div style={{ padding: '10px', maxWidth: '500px', textAlign: 'center', marginBottom: '10px' }}>
          <p><a href="https://www.linkedin.com/in/emre-inal">www.linkedin.com/in/emre-inal</a></p>
        </div>

        <div style={{ backgroundColor: '#A3BFFA', padding: '20px', maxWidth: '500px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px' }}></h2>
          <p>This application allows researchers to define and monitor user behaviors on a web applications.</p>
        </div>
      </div>

      <p></p>

      <p></p>

    </div>
  </>
};

export default About;
