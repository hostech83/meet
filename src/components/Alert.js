// src/components/Alert.js

import React, { Component } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

class Alert extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.color = null;
    this.bgColor = null;
  }

  getStyle = () => {
    const { isDarkMode } = this.context;
    return {
      color: isDarkMode ? this.darkModeColor : this.color,
      backgroundColor: isDarkMode ? this.darkModeBgColor : this.bgColor,
      borderWidth: "4px",
      borderStyle: "solid",
      fontWeight: "bold",
      borderRadius: "7px",
      borderColor: isDarkMode ? this.darkModeColor : this.color,
      textAlign: "center",
      fontSize: "18px",
      margin: "10px 0",
      padding: "10px",
    };
  };

  render() {
    return (
      <div className="Alert">
        <p style={this.getStyle()}>{this.props.text}</p>
      </div>
    );
  }
}

class InfoAlert extends Alert {
  constructor(props) {
    super(props);
    this.color = "rgb(0, 0, 255)"; // blue
    this.bgColor = "rgb(220, 220, 255)"; // light blue
    this.darkModeColor = "white"; // light blue
    this.darkModeBgColor = "rgb(0, 77, 150)"; // midnight blue
  }
}

class ErrorAlert extends Alert {
  constructor(props) {
    super(props);
    this.color = "rgb(255, 0, 0)"; // red
    this.bgColor = "rgb(255, 200, 200)"; // light red
    this.darkModeColor = "white";
    this.darkModeBgColor = "rgb(191, 0, 0)"; // dark red
  }
}

class WarningAlert extends Alert {
  constructor(props) {
    super(props);
    this.color = "black";
    this.bgColor = "#FFE696";
    this.darkModeColor = "black";
    this.darkModeBgColor = "#FFE696";
  }
}

export { InfoAlert, ErrorAlert, WarningAlert };
