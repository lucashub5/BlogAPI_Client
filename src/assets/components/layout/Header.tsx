import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  isLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn }) => {
  const location = useLocation();

  const saveLastPath = () => { 
    if (location.pathname !== '/register') {
      localStorage.setItem('lastPath', location.pathname);
    }
  };

  return (
    <header>
      <div className='logo'>
        <Link to='/'><h1>Blog API</h1></Link>
      </div>
      <nav>
        <ul>
          {!isLoggedIn && (
            <>
              <li>
                <Link to='/login' onClick={saveLastPath}>Log In</Link>
              </li>
              <li>
                <Link to='/register'>Register</Link>
              </li>
            </>
          )}
          {isLoggedIn && (
            <>              
              <li>
                <Link to='/article_create'>Create Blog</Link>
              </li>
              <li>
                <Link to='/profile'>Profile</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;