import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button, Dropdown, Form, Modal, Offcanvas } from 'react-bootstrap';
import { UserContext } from '../context/common';

import './style.css';

const Header = () => {
   const [show, setShow] = useState(false);
   const [hiddenModal, setHiddenModal] = useState(false);

   const [darkMode, setDarkMode] = useState(false);

   const closeSidebar = () => setShow(false);
   const openSidebar = () => setShow(true);

   const { isUserLogin, setIsUserLogin } = useContext(UserContext);
   const navigate = useNavigate();

   const signOutClick = () => {
      localStorage.removeItem('AuthToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      setIsUserLogin(false);
      navigate('/sign-in');
   };

   useEffect(() => {
      const isDark = localStorage.getItem('isDark')
      if(isDark == 'true'){
         setDarkMode(true)
      } else if (isDark === 'false'){
         setDarkMode(false)
      }
   }, [])

   useEffect(() => {
      if (darkMode) {
         localStorage.setItem('isDark', 'true')
         // window.location.reload()
      } else {
         localStorage.setItem('isDark', 'false')
         // window.location.reload()
      }
   }, [darkMode]);

   return (
      <>
         <nav
            className="navbar navbar-expand-lg bg-dark navbar-dark py-3 fixed-top px-3"
            id="top-nav"
         >
            <div className="container">
               <i
                  className="bi bi-list"
                  onClick={openSidebar}
                  style={{
                     cursor: 'pointer',
                     color: '#fff',
                     fontSize: '30px',
                  }}
               ></i>
               <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                     <i className="bi bi-person-fill"></i>{' '}
                     {localStorage.getItem('username')}
                  </Dropdown.Toggle>
                  {isUserLogin ? (
                     <Dropdown.Menu>
                        <Dropdown.Item
                           onClick={() => {
                              navigate('/user/setting');
                           }}
                        >
                           Setting
                        </Dropdown.Item>
                        <Dropdown.Item onClick={signOutClick}>
                           Sign Out
                        </Dropdown.Item>
                     </Dropdown.Menu>
                  ) : (
                     <Dropdown.Menu>
                        <Dropdown.Item>
                           <Link to={'/sign-in'}>Sign In</Link>
                        </Dropdown.Item>
                     </Dropdown.Menu>
                  )}
               </Dropdown>
               <div
                  className="navbar-brand hoverPointer"
                  style={{
                     borderStyle: 'solid',
                     borderWidth: '2px',
                     borderColor: 'gray',
                     borderRadius: '10px',
                  }}
                  onClick={() => {setHiddenModal(true)}}
               >
                  <img src={`/flashionary.png`} style={{ width: 30 }} alt="" />{' '}
               </div>
            </div>
         </nav>
         <div style={{ width: '100%', height: '80px', display: 'block' }}></div>

         <Offcanvas show={show} onHide={closeSidebar}>
            <Offcanvas.Body className="sideNav">
               <button className="btn-close mx-auto" onClick={closeSidebar}>
                  &times;
               </button>
               <Link
                  to={'/vocabs/add'}
                  onClick={closeSidebar}
                  className="menu-item"
               >
                  Add Vocab+
               </Link>
               <Link
                  to={'/vocabs'}
                  onClick={closeSidebar}
                  className="menu-item"
               >
                  Vocabs
               </Link>
               {/* <Link
                  to={'/vocabs/groups'}
                  onClick={closeSidebar}
                  className="menu-item"
               >
                  Vocab Groups
               </Link> */}
               <Link
                  to={'/vocabs/review'}
                  onClick={closeSidebar}
                  className="menu-item"
               >
                  Review
               </Link>
               <Link
                  to={'/vocabs/dict'}
                  onClick={closeSidebar}
                  className="menu-item"
               >
                  Dict
               </Link>
               <hr style={{ color: '#fff' }} />
               <Link
                  to={'/sentences/add'}
                  onClick={closeSidebar}
                  className="menu-item"
               >
                  Add Sentence
               </Link>
               <Link
                  to={'/sentences'}
                  onClick={closeSidebar}
                  className="menu-item"
               >
                  Sentences
               </Link>
               <Link
                  to={'/sentences/review'}
                  onClick={closeSidebar}
                  className="menu-item"
               >
                  Review
               </Link>
               {/* <Link
                  to={'/sentences/replacement'}
                  onClick={closeSidebar}
                  className="menu-item"
               >
                  Replacement
               </Link> */}
               <Link
                  to={'/sentences/dict'}
                  onClick={closeSidebar}
                  className="menu-item"
               >
                  Dict
               </Link>
               <Link
                  to={'/stories'}
                  onClick={closeSidebar}
                  className="menu-item"
               >
                  Story
               </Link>
            </Offcanvas.Body>
         </Offcanvas>

         <Modal
            show={hiddenModal}
            onHide={() => {
               setHiddenModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>
                  Toggle this check button and reload the page
               </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Form.Check
                  type="switch"
                  onChange={e => {
                     setDarkMode(e.target.checked)
                  }}
                  checked={darkMode}
                  label="DarkMode"
               />
            </Modal.Body>
         </Modal>
      </>
   );
};

export default Header;
