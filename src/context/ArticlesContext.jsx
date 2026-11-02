import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import { useAuth } from './AuthContext';

const ArticlesContext = createContext();

export function ArticlesProvider({ children }) {

  const { user } = useAuth();

  const [savedArticlesByUser, setSavedArticlesByUser] = useState(() => {
    try {
      const saved = localStorage.getItem('newsreader_saved_articles');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save articles between browser sessions
  useEffect(() => {
    localStorage.setItem(
      'newsreader_saved_articles',
      JSON.stringify(savedArticlesByUser)
    );
  }, [savedArticlesByUser]);

  // Get the current username
  const username = user?.username;

  // Get articles belonging to the logged-in user
  const getUserSavedArticles = () => {
    if (!username) return [];

    return savedArticlesByUser[username] || [];
  };

  // Save an article for the current user
  const saveArticle = (article) => {
    if (!username) return;

    setSavedArticlesByUser(prev => {

      const userArticles = prev[username] || [];

      if (userArticles.some(a => a.url === article.url)) {
        return prev;
      }

      return {
        ...prev,
        [username]: [...userArticles, article]
      };

    });
  };

  // Remove an article belonging to the current user
  const removeArticle = (url) => {
    if (!username) return;

    setSavedArticlesByUser(prev => ({
      ...prev,
      [username]: (prev[username] || []).filter(
        article => article.url !== url
      )
    }));
  };

  // Check whether the current user saved an article
  const isArticleSaved = (url) => {
    return getUserSavedArticles().some(
      article => article.url === url
    );
  };

  // Get all users' saved articles (for administrators)
  const getAllUserArticles = () => {
    return savedArticlesByUser;
  };

  return (
    <ArticlesContext.Provider
      value={{
        savedArticles: getUserSavedArticles(),
        savedArticlesByUser,
        getUserSavedArticles,
        getAllUserArticles,
        saveArticle,
        removeArticle,
        isArticleSaved
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
}

export const useArticles = () => {

  const context = useContext(ArticlesContext);

  if (!context) {
    throw new Error(
      'useArticles must be used within ArticlesProvider'
    );
  }

  return context;
};