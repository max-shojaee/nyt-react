import React from "react";

const cssStyle = {clear: 'both' };

const Jumbotron = ({ children }) =>
  <div style={cssStyle} className="jumbotron">
    {children}
  </div>;

export default Jumbotron;
