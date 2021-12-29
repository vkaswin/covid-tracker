import React, { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log(error);
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;

    const { children } = this.props;

    if (hasError)
      return (
        <div>
          <h1>Something went wrong.</h1>
        </div>
      );

    return children;
  }
}
