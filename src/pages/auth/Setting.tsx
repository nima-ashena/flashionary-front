import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { IAddSentence } from '../../interface/sentence.interface';
import { Dropdown } from 'react-bootstrap';
import { TTSTypes } from '../../utils/constants';
import { IUser } from '../../interface/user';
import { editUserApi, getUserApi } from '../../api/auth.service';

const Setting = () => {
   const emptyData: IUser = {
      name: '',
      email: '',
      username: '',
      defaultTTSEngine: '',
   };
   const [userData, setUserData] = useState<IUser>(emptyData);

   useEffect(() => {
      getUserApi((isOk: boolean, result) => {
         if (isOk) {
            setUserData(result.user);
         } else {
            console.log(result);
         }
      });
   }, []);

   const editUserClick = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const id = toast.loading('Editing...');
      editUserApi(userData._id, userData, (isOk, result) => {
         if (isOk) {
            toast.update(id, {
               render: 'Done',
               type: 'success',
               isLoading: false,
               autoClose: 1500,
            });
            localStorage.setItem(
               'defaultTTSEngine',
               result.user.defaultTTSEngine,
            );
         } else {
            toast.update(id, {
               render: result.message,
               type: 'error',
               isLoading: false,
               autoClose: 1500,
            });
            toast.error(result.message);
         }
      });
   };

   const changeDefaultTTSEngineClick = (item: string) => {
      setUserData({
         ...userData,
         defaultTTSEngine: item,
      });
   };

   return (
      <div className="container">
         <p className="mt-3 font-weight-bold" style={{ fontSize: 27 }}>
            Setting
         </p>
         <form
            className="pt-3 col-sm-12 col-md-10 col-lg-8"
            onSubmit={event => {
               editUserClick(event);
            }}
         >
            <div className="mb-3 col-lg-6">
               <label className="form-label">Username: </label>
               <input
                  type="text"
                  className="form-control"
                  onChange={e => {
                     setUserData({ ...userData, username: e.target.value });
                  }}
                  value={userData.username}
               />
            </div>
            <div className="mb-3">
               <label className="form-check-label">
                  Default TTS:{' '}
                  <span style={{ fontWeight: 800 }}>
                     {userData.defaultTTSEngine}
                  </span>{' '}
                  <Dropdown style={{ display: 'inline' }}>
                     <Dropdown.Toggle
                        variant="secondary"
                        id="dropdown-basic"
                     ></Dropdown.Toggle>
                     <Dropdown.Menu>
                        {TTSTypes.map(item => {
                           return (
                              <Dropdown.Item
                                 onClick={e => {
                                    changeDefaultTTSEngineClick(item);
                                 }}
                              >
                                 {item}
                              </Dropdown.Item>
                           );
                        })}
                     </Dropdown.Menu>
                  </Dropdown>
               </label>
            </div>

            <button
               type="submit"
               className="btn btn-primary btn-lg w-100 add-btn mb-3"
            >
               Edit
            </button>
         </form>
      </div>
   );
};

export default Setting;
