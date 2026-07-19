import { Component } from "react";
import PropTypes from "prop-types";

/**
 * Only a class component can catch render errors in React, so this one
 * stays a class on purpose. It's what stands between a user and a blank
 * screen if the micro frontend's deployment is down, mid-deploy, or the
 * remoteEntry.js just fails to load over a flaky connection.
 */
export default class RemoteErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Music Library remote failed to load:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="font-display text-lg text-deck-cream">The library is offline.</p>
          <p className="text-sm text-deck-muted mt-1 max-w-md mx-auto">
            The Music Library micro frontend couldn't be reached. It may be redeploying, or the
            remote URL in this app's configuration may be out of date.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 rounded-sm border border-deck-amber/60 px-4 py-1.5 text-xs uppercase tracking-widest2 text-deck-amber hover:bg-deck-amber hover:text-deck-bg transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

RemoteErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
