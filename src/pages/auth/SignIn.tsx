import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signInApi } from '../../api/auth.service';
import { UserContext } from '../../context/common';

const SignIn = () => {
   const navigate = useNavigate();

   // const [email, setEmail] = useState('example@gmail.com');
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');

   const { isUserLogin, setIsUserLogin } = useContext(UserContext);

   const signInClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const id = toast.loading('Signing in...');
      signInApi(
         {
            username,
            password,
         },
         (isOk, result) => {
            if (isOk) {
               toast.update(id, {
                  render: 'Sign in was successful',
                  type: 'success',
                  isLoading: false,
                  autoClose: 2000,
               });
               localStorage.setItem('AuthToken', result.token);
               localStorage.setItem(
                  'defaultTTSEngine',
                  result.user.defaultTTSEngine,
               );
               localStorage.setItem('username', result.user.username);
               localStorage.setItem('userId', result.user._id);
               setIsUserLogin(true);
               navigate('/');
            } else {
               toast.update(id, {
                  render: result.response.data.message,
                  type: 'error',
                  isLoading: false,
                  autoClose: 2000,
               });
               // toast.error(result.response.data.message);
               // console.log(result);
            }
         },
      );
   };

   return (
      <div className="container">
         <form className="pt-3 col-sm-8 col-md-6 col-lg-4">
            <div className="mb-3">
               <label className="form-label">Username</label>
               <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={e => {
                     setUsername(e.target.value);
                  }}
               />
            </div>
            <div className="mb-3">
               <label className="form-label">Password</label>
               <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  value={password}
                  onChange={e => {
                     setPassword(e.target.value);
                  }}
               />
            </div>
            <button
               type="submit"
               className="btn btn-primary w-100"
               onClick={e => {
                  signInClick(e);
               }}
            >
               Sign In
            </button>
         </form>
      </div>
   );
};

export default SignIn;
