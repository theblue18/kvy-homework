import { Link } from "react-router-dom";

/**
 * NoMatch Component
 * Displayed when no matching route is found.
 *
 * @component
 * @returns {JSX.Element} - The rendered NoMatch component
 */
export default function NoMatch() {
    return (
      <div>
        <h2>Nothing to see here!</h2>
        <p>
          <Link to="/">Go to the home page</Link>
        </p>
      </div>
    )
  }