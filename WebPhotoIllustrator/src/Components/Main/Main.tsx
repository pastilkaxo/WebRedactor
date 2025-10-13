import React from 'react';
import Auth from './AuthForm/Auth';



export default function Main() {

  return (
    <div className="main-container">
      <section id="section1" className="section roboto-font">
          {true ? <Auth/> : null}
      </section>
      <section id="section2" className="section">
        <h1>Section 2</h1>
        <p>Content for section 2...</p>
      </section>
    </div>
  );
}