import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './style.css';
import Header from './components/Header';
import RoutesHandle from './routes';
import { UserContext } from './context/common';
import { useEffect, useState } from 'react';
import { getUserApi, getUsersApi } from './api/auth.service';
import { IVocab } from './interface/vocab.interface';

function App() {
   // console.log(process.env.REACT_APP_API_BASE_URL);
   const [isUserLogin, setIsUserLogin] = useState<boolean>(false);
   const [vocabs, setVocabs] = useState<IVocab[]>([]);
   const [users, setUsers] = useState([
      {
         _id: localStorage.getItem('userId'),
         username: localStorage.getItem('username'),
      },
   ]);
   const [userC, setUserC] = useState<number>(0);
   const [query, setQuery] = useState<string>('');
   const [paginationPage, setPaginationPage] = useState<number>(1);
   const [sort, setSort] = useState<string>('-created_at');
   const [type, setType] = useState<string>('all');

   useEffect(() => {
      getUserApi((isOk: boolean, result) => {
         if (isOk) {
            setIsUserLogin(true);
         } else {
            setIsUserLogin(false);
         }
      });
      getUsersApi((isOk, result) => {
         if (isOk) {
            let t = [
               {
                  _id: localStorage.getItem('userId'),
                  username: localStorage.getItem('username'),
               },
            ];
            let t2 = [{ _id: '', username: 'All Users' }];

            for (let i in result.users) {
               if (
                  result.users[i].username !== localStorage.getItem('username')
               ) {
                  t.push({
                     _id: result.users[i]._id,
                     username: result.users[i].username,
                  });
               }
            }
            setUsers([...t, ...t2]);
         }
      });
   }, []);

   return (
      <>
         <UserContext.Provider
            value={{
               isUserLogin,
               setIsUserLogin,
               vocabs,
               setVocabs,
               users,
               setUsers,
               userC,
               setUserC,
               query,
               setQuery,
               paginationPage,
               setPaginationPage,
               sort,
               setSort,
               type,
               setType,
            }}
         >
            <RoutesHandle />
            <ToastContainer />
         </UserContext.Provider>
      </>
   );
}

export default App;

export const setLocalStorage = data => {
   // localStorage.setItem('AuthToken', data.token);
   // localStorage.setItem('defaultTTSEngine', data.user.defaultTTSEngine);
   // localStorage.setItem('username', data.user.username);
   // localStorage.setItem('userId', data.user._id);
   // setIsUserLogin(true);
};
