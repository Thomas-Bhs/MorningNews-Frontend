import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import { addHiddenArticles, removeHiddenArticles } from '../reducers/hiddenArticles';
import Image from 'next/image';
import styles from '../styles/Article.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

function Article(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const hiddenArticles = useSelector((state) => state.hiddenArticles.value);

  const isHidden = hiddenArticles.some((e) => e.title === props.title);

  //gestion of image error
  const [imgSrc, setImgSrc] = useState(props.urlToImage || '/placeholder-image.jpg');
  // reload when image change
  useEffect(() => {
    setImgSrc(props.urlToImage || '/placeholder-image.jpg');
  }, [props.urlToImage]);

  const openArticle = () => {
    if (props.url) {
      window.open(props.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleHiddenArticlesClick = (e) => {
    e.stopPropagation(); //the event ('click') is not propagated to parent elements (openArticle)
    if (isHidden) {
      dispatch(removeHiddenArticles(props));
    } else {
      dispatch(addHiddenArticles(props));
    }
  };

  const addBookmarkToDB = async () => {
    console.log('TOKEN', user.token);
    console.log('props', props);
    const response = await fetch('http://localhost:3000/bookmarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        title: props.title,
        url: props.url,
        source: props.source.name,
        urlToImage: props.urlToImage,
        description: props.description,
        author: props.author,
      }),
    });

    return response.json();
  };

  const removeBookmarkFromDB = async () => {
    console.log('article delete props', props);
    const response = await fetch(`http://localhost:3000/bookmarks/${props._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    return response.json();
  };

  const handleBookmarkClick = async (e) => {
    e.stopPropagation(); //the event ('click') is not propagated to parent elements (openArticle)
    if (!user?.token) {
      return;
    }

    try {
      if (props.isBookmarked) {
        const data = await removeBookmarkFromDB();

        if (data.result) {
          dispatch(removeBookmark(props));
        }
      } else {
        const data = await addBookmarkToDB();

        if (data.result) {
          dispatch(
            addBookmark({
              ...data.bookmark,
              bookmarkId: data.bookmark._id,
              isBookmarked: true,
            })
          );
        }
      }
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  let iconStyle = {};
  if (props.isBookmarked) {
    iconStyle = { color: '#E9BE59' };
  }

  return (
    <div className={styles.articles} onClick={openArticle}>
      <div className={styles.articleHeader}>
        <h3>{props.title}</h3>
        <FontAwesomeIcon
          onClick={(e) => handleBookmarkClick(e)}
          icon={faBookmark}
          style={iconStyle}
          className={styles.bookmarkIcon}
        />
        <FontAwesomeIcon
          onClick={(e) => handleHiddenArticlesClick(e)}
          icon={isHidden ? faEyeSlash : faEye}
          style={iconStyle}
          className={styles.faEyeSlashIcon}
        />
      </div>
      <h4 style={{ textAlign: 'right' }}>- {props.author}</h4>
      <div className={styles.divider}></div>
      <Image
        src={imgSrc}
        alt={props.title}
        width={600}
        height={314}
        onError={() => setImgSrc('/placeholder-image.jpg')}
      />
      <p>{props.description}</p>
    </div>
  );
}

export default Article;
