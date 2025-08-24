import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Login from "./components/login";
import pfp from './3d-profile-button_459124-909.webp';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // track login state

  return (
    <Router>
      <nav className="navbar navbar-expand-lg bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand text-white" to="/">CollegeConnect</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">Home</Link>
              </li>
            </ul>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {isLoggedIn ? (
                <>
                  {/* Profile picture */}
                  <li className="nav-item me-2">
                    <img 
                      src={pfp} 
                      alt="Profile" 
                      className="rounded-circle" 
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    />
                    </li>
                <li className="nav-item">
                  <button 
                    className="btn btn-danger nav-link text-white" 
                    onClick={() => setIsLoggedIn(false)}
                  >
                    Logout
                  </button>
                </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login">Login</Link>
                </li>
              )}
            </ul>

            <form className="d-flex ms-2" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-light" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<h1 className="m-3">Welcome to CollegeConnect</h1>} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </Router>
  );
}

export default App;
