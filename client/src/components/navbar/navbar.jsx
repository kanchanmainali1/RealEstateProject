import { useContext, useState, useEffect } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  useEffect(() => {
    if (currentUser) {
      fetch();
    }
  }, [currentUser, fetch]);

  return (
    <div>
      <nav>
        <div className="left">
          <Link to="/" className="logo">
            <img src="/homelogo.png" alt="" />
            <span>HomeHeaven</span>
          </Link>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/list">Listing</Link>
        </div>
        <div className="right">
          {currentUser ? (
            <div className="user">
              <img src={currentUser.avatar || "/noavatar.png"} alt="" />
              <span>{currentUser.username}</span>
              <Link to="/profile" className="profile">
                {number > 0 && <div className="notification">{number}</div>}
                <span>Profile</span>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login">Sign in</Link>
              <Link to="/register" className="register">
                Sign up
              </Link>
            </>
          )}
          <div className="menuIcon">
            <img
              src="/menu.png"
              alt=""
              onClick={() => setOpen((prev) => !prev)}
            />
          </div>
          <div className={open ? "menu active" : "menu"}>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/list">Listing</Link>
            <Link to="/login">Sign in</Link>
            <Link to="/register">Sign up</Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
