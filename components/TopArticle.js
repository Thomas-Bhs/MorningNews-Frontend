import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import styles from '../styles/TopArticle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

function TopArticle(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [imgSrc, setImgSrc] = useState(props.urlToImage || '/placeholder-image.jpg');

  //reload when the urlToImage is fetch
  useEffect(() => {
    if (props.urlToImage) {
      setImgSrc(props.urlToImage);
    }
  }, [props.urlToImage]);

  const openArticle = () => {
    if(props.url) {
      window.open(props.url, '_blank', 'noopener,noreferrer');
    }
  };

  const addBookmarkToDB = async () => {
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
    if (!props.bookmarkId) {
      return;
    }

    const response = await fetch(`http://localhost:3000/bookmarks/${props.bookmarkId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return response.json();
  };

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
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
          dispatch(addBookmark(data.bookmark));
        }
      }
    } catch (error) {
      console.error('TopArticle bookmark error:', error);
    }
  };

  let iconStyle = {};
  if (props.isBookmarked) {
    iconStyle = { color: '#E9BE59' };
  }

  return (
    <div className={styles.topContainer}
    onClick={openArticle}>
      <Image
        src={imgSrc}
        alt={props.title}
        width={700}
        height={400}
        priority
        unoptimized
        onError={() => setImgSrc('/placeholder-image.jpg')}
      />
      <div className={styles.topText}>
        <h2 className={styles.topTitle}>{props.title}</h2>
        <FontAwesomeIcon
          onClick={(e) => handleBookmarkClick(e)}
          icon={faBookmark}
          style={iconStyle}
          className={styles.bookmarkIcon}
        />
        <h4>{props.author}</h4>
        <p>{props.description}</p>
      </div>
    </div>
  );
}

export default TopArticle;
