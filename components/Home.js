import { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import Article from './Article';
import TopArticle from './TopArticle';
import styles from '../styles/Home.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { openAuthModal } from '../reducers/authModal';
import { closeSearch, setQuery } from '../reducers/search';

function Home() {
  const dispatch = useDispatch();

  const bookmarks = useSelector((state) => state.bookmarks.value);
  const hiddenArticles = useSelector((state) => state.hiddenArticles.value);
  const user = useSelector((state) => state.user.value);

  const { isOpen, query } = useSelector((state) => state.search);

  const [articlesData, setArticlesData] = useState([]);
  const [topArticle, setTopArticle] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hideHiddenArticles, setHideHiddenArticles] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // function to check if an article is hidden
  const isHidden = (article) => hiddenArticles.some((hidden) => hidden.title === article.title);

  const isFetchingRef = useRef(false); // Ref to track if fetchArticles is in progress

  const fetchArticles = useCallback(
    async (pageToLoad) => {
      if (isFetchingRef.current) return; // Prevent concurrent fetches

      //stop infinite scroll if not logged
      if (!user?.token && pageToLoad > 1) {
        setShowLoginModal(true);
        setHasMore(false);
        return;
      }

      isFetchingRef.current = true; // Set the ref to indicate fetch is in progress
      setLoading(true);

      try {
        const headers = {};
        if (user?.token) {
          headers.Authorization = `Bearer ${user.token}`;
        }

        const response = await fetch(`http://localhost:3000/articles?page=${pageToLoad}`, {
          headers,
        });

        const data = await response.json();

        const articles = Array.isArray(data.articles) ? data.articles : [];

        if (pageToLoad === 1) {
          setTopArticle(data.articles[0] || {});
          setArticlesData(data.articles.slice(1));
        } else {
          setArticlesData((prev) => [...prev, ...articles]);
        }
        setHasMore(data.hasMore);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
        isFetchingRef.current = false; // Reset the ref after fetch is complete
      }
    },
    [user?.token]
  );

  //first load
  useEffect(() => {
    fetchArticles(1);
  }, [fetchArticles]);

  //fetch on page change
  useEffect(() => {
    if (page > 1) {
      fetchArticles(page);
    }
  }, [page, fetchArticles]);

  //load more on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isFetchingRef.current || loading || query !== '' || showLoginModal || !hasMore) {
        return;
      }

      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.offsetHeight - 150;

      if (scrollPosition >= threshold && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, query, showLoginModal]);

  const prevTokenRef = useRef(user?.token); //track previous token value

  // Reset when user logs out
  useEffect(() => {
    const prevToken = prevTokenRef.current;

    //if there was a token and now there isn't
    if (prevToken && !user?.token) {
      dispatch(closeSearch());
      setArticlesData([]);
      setTopArticle({});
      setPage(1);
      setHasMore(true);
      setLoading(false);
      setShowLoginModal(false);
      fetchArticles(1);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    prevTokenRef.current = user?.token; //update ref to current token
  }, [user?.token]);

  //filtre dans articlesData les visibles
  const visibleArticlesData = hideHiddenArticles
    ? articlesData.filter((article) => !isHidden(article))
    : articlesData;

  const articles = visibleArticlesData.map((data, i) => {
    const isBookmarked = bookmarks.some((bookmark) => bookmark.title === data.title);

    return <Article key={i} {...data} isBookmarked={isBookmarked} />;
  });

  let topArticles;
  if (bookmarks.some((bookmark) => bookmark.title === topArticle.title)) {
    topArticles = <TopArticle {...topArticle} isBookmarked={true} />;
  } else {
    topArticles = <TopArticle {...topArticle} isBookmarked={false} />;
  }

  // Search function
  const handleSearch = async () => {
    if (query.trim() === '') return;

    if (!user?.token) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);

    const response = await fetch(`http://localhost:3000/articles/search?q=${query}&page=1`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (response.status === 401) {
      setLoading(false);
      dispatch(openAuthModal());
      return;
    }

    const data = await response.json();

    if (!data.result && data.error === 'LOGIN_REQUIRED') {
      setLoading(false);
      return;
    }

    if (data.result) {
      setArticlesData(data.articles);
      setPage(1);
    }
    setLoading(false);
  };

  const handleCloseSearch = () => {
    dispatch(closeSearch());
    setArticlesData([]);
    setTopArticle({});
    setPage(1);
    setHasMore(true);
    // Re-fetch the initial articles
    fetchArticles(1);
  };

  return (
    <div>
      <Head>
        <title>Morning News - Home</title>
      </Head>
      {isOpen && (
        <div className={styles.searchBar}>
          <input
            type='text'
            placeholder='Search articles...'
            value={query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <div className={styles.actions}>
            <button onClick={() => handleSearch()}>Search</button>
            <button onClick={handleCloseSearch}>Close</button>
          </div>
        </div>
      )}
      <div className={styles.homeActions}>
        <FontAwesomeIcon
          icon={hideHiddenArticles ? faEyeSlash : faEye}
          className={styles.eyeIcon}
          onClick={() => setHideHiddenArticles(!hideHiddenArticles)}
        />
      </div>
      {query === '' && topArticles}
      <div className={styles.articlesContainer}>
        {articles}
        {loading && <p>Loading...</p>}
      </div>
      {showLoginModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Login Required</h2>
            <p>Please log in to load more articles.</p>
            <button
              onClick={() => {
                setShowLoginModal(false);
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
                dispatch(openAuthModal());
              }}
            >
              Login
            </button>
            <button
              onClick={() => {
                setShowLoginModal(false);
                setHasMore(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
