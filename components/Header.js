import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../reducers/user';
import { removeAllBookmark } from '../reducers/bookmarks';
import styles from '../styles/Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark, faEye } from '@fortawesome/free-solid-svg-icons';
import Moment from 'react-moment';
import { Modal } from 'antd';
import Link from 'next/link';
import { removeAllHiddenArticles } from '../reducers/hiddenArticles';
import { openAuthModal, closeAuthModal } from '../reducers/authModal';
import {openSearch} from '../reducers/search';


function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [date, setDate] = useState('2050-11-22T23:59:59');
  //const [isModalVisible, setIsModalVisible] = useState(false);
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signInUsername, setSignInUsername] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isAuthModalOpen = useSelector((state) => state.authModal.isOpen);

  useEffect(() => {
    setDate(new Date());
  }, []);

  const handleRegister = () => {

    setErrorMessage('');

    fetch('http://localhost:3000/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: signUpUsername, password: signUpPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.result) {
          setErrorMessage(data.error);
          return;
        }
          dispatch(login({ username: signUpUsername, token: data.token }));
          setSignUpUsername('');
          setSignUpPassword('');
          dispatch(closeAuthModal());
      });
  };

  const handleConnection = () => {
    setErrorMessage('');

    fetch('http://localhost:3000/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: signInUsername, password: signInPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('SIGNIN RESPONSE:', data);
        if (!data.result) {
          setErrorMessage(data.error);
          return;
        } 
          dispatch(login({ username: signInUsername, token: data.accessToken }));
          setSignInUsername('');
          setSignInPassword('');
          dispatch(closeAuthModal());
      });
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(removeAllBookmark());
  };

  const showModal = () => {
    dispatch(openAuthModal());
  };

  let modalContent;
  if (!user) {
    modalContent = (
      <div className={styles.registerContainer}>
        <div className={styles.formsRow}>
          <div className={styles.registerSection}>
          <p>Sign-up</p>
          <input
            type='text'
            placeholder='Username'
            id='signUpUsername'
            onChange={(e) => setSignUpUsername(e.target.value)}
            value={signUpUsername}
          />
          <input
            type='password'
            placeholder='Password'
            id='signUpPassword'
            onChange={(e) => setSignUpPassword(e.target.value)}
            value={signUpPassword}
          />
          <button id='register' onClick={() => handleRegister()}>
            Register
          </button>
        </div>
        <div className={styles.registerSection}>
          <p>Sign-in</p>
          <input
            type='text'
            placeholder='Username'
            id='signInUsername'
            onChange={(e) => setSignInUsername(e.target.value)}
            value={signInUsername}
          />
          <input
            type='password'
            placeholder='Password'
            id='signInPassword'
            onChange={(e) => setSignInPassword(e.target.value)}
            value={signInPassword}
          />
          <button id='connection' onClick={() => handleConnection()}>
            Connect
          </button>
        </div>
        </div>
        {errorMessage && (
          <p className={styles.error}>{errorMessage}</p>)}
      </div>
    );
  }

  let userSection;
  if (user?.token) {
    userSection = (
      <div className={styles.logoutSection}>
        <p>Welcome {user.username} / </p>
        <button onClick={() => handleLogout()}>Logout</button>
      </div>
    );
  }  else {
      userSection = (
        <div className={styles.headerIcons}>
         <FontAwesomeIcon
        onClick={() =>{
          setErrorMessage('');
          isAuthModalOpen ? dispatch(closeAuthModal()) : dispatch(openAuthModal());
        }}
        className={styles.userSection}
        icon={isAuthModalOpen ? faXmark : faUser}
      />
        </div>
      );
  }

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Moment className={styles.date} date={date} format='MMM Do YYYY' />
        <h1 className={styles.title}>Morning News</h1>
        {userSection}
      </div>

      <div className={styles.linkContainer}>
        <Link href='/'>
          <span className={styles.link}>Articles</span>
        </Link>
        <Link href='/bookmarks'>
          <span className={styles.link}>Bookmarks</span>
        </Link>
        <span
        className= {styles.link}
        onClick={() => dispatch(openSearch())}
        >
        Search
        </span>
      </div>

      {isAuthModalOpen && (
        <div id='react-modals'>
          <Modal
            getContainer='#react-modals'
            className={styles.modal}
            open={isAuthModalOpen}
            closable={false}
            footer={null}
          >
            {modalContent}
          </Modal>
        </div>
      )}
    </header>
  );
}

export default Header;
