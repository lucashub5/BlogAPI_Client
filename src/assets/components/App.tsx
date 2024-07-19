import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Main from './layout/Main';
import UserLogin from './views/users/UserLogin';
import UserRegister from './views/users/UserRegister';
import ArticleList from './views/articles/ArticlesList';
import ArticleDetail from './views/articles/ArticleDetail';
import UserProfile from './views/users/UserProfile';
import ArticleCreate from './views/articles/ArticleCreate';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
      setLoading(false);
    };

    const checkGoogleToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const googleToken = urlParams.get('token');

      if (googleToken) {
        localStorage.setItem('token', googleToken);
        const lastPath = localStorage.getItem('lastPath') || '/';
        localStorage.removeItem('lastPath');
        window.location.href = lastPath;
      }
    };
  
    checkLoginStatus();
    checkGoogleToken();
  }, []);

  if (loading) {
    return <div className="loading-overlay"><div className="spinner"></div></div>
  }

  return (
    <BrowserRouter>
      <div className='content'>
        <Header isLoggedIn={isLoggedIn} />
        <Main>
          <Routes>
            <Route path="/" element={<ArticleList />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            
            {isLoggedIn ? (
              <>
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/article_create" element={<ArticleCreate />} />
              </>
            ) : (
              <>
                <Route path="/login" element={<UserLogin />} />
                <Route path="/register" element={<UserRegister />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;