import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
   addVocabGroupApi,
   getVocabGroupsApi,
} from '../../../api/vocabGroup.service';
import VocabGroup from './VocabGroup';
import { IVocabGroup } from '../../../interface/vocabGroup.interface';
import { GroupTypes } from '../../../utils/constants';

const VocabGroups = () => {
   const [vocabGroup, setVocabGroup] = useState<IVocabGroup>({
      title: '',
      groupKind: GroupTypes[0],
   });
   const [addModal, setAddModal] = useState(false);

   const [vocabGroups, setVocabGroups] = useState<IVocabGroup[]>([]);
   const [render, setRender] = useState<boolean>(false);

   useEffect(() => {
      getVocabGroupsApi((isOk, result) => {
         if (isOk) {
            setVocabGroups(result.vocabGroups);
         } else {
            console.log(result.message);
         }
      });
   }, [render]);

   const addVocabGroupClick = () => {
      if (vocabGroup.title === '') return toast.warn('Please fill title');

      const id = toast.loading('Adding VocabGroup...');
      addVocabGroupApi(vocabGroup, (isOk, result) => {
         if (isOk) {
            toast.update(id, {
               render: 'vocabGroup added successfully',
               type: 'success',
               isLoading: false,
               autoClose: 2000,
            });
            // setVocabGroupTitle('');
            setAddModal(false);
            setRender(!render);
         } else {
            console.log(result.message);
            toast.update(id, {
               render: result.response.data.message,
               type: 'error',
               isLoading: false,
               autoClose: 2000,
            });
         }
      });
   };

   return (
      <div className="container">
         <div className="p-3 row">
            <button
               className="btn btn-secondary col-md-8 col-lg-6"
               onClick={() => {
                  setAddModal(true);
               }}
            >
               Add VocabGroup
               <i className="bi bi-plus"></i>
            </button>
            <Modal
               show={addModal}
               onHide={() => {
                  setAddModal(false);
               }}
            >
               <Modal.Header closeButton>
                  <Modal.Title>Add VocabGroup</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <form>
                     <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                           type="text"
                           className="form-control"
                           aria-describedby="emailHelp"
                           value={vocabGroup.title}
                           onChange={e => {
                              setVocabGroup({
                                 ...vocabGroup,
                                 title: e.target.value,
                              });
                           }}
                        />
                     </div>
                     <div className="mb-3">
                        <label className="form-label">Type:</label>
                        <select
                           className="form-select mb-3"
                           aria-label="Default select example"
                           onChange={e => {
                              setVocabGroup({
                                 ...vocabGroup,
                                 groupKind: e.target.value,
                              });
                           }}
                        >
                           {GroupTypes.map(item => {
                              return <option value={item}>{item}</option>;
                           })}
                        </select>
                     </div>
                  </form>
                  <Button
                     className="w-100"
                     variant="primary"
                     onClick={addVocabGroupClick}
                  >
                     Add vocabGroup
                  </Button>
               </Modal.Body>
            </Modal>
         </div>

         <div className="row align-items-center px-1 g-1">
            {vocabGroups.length === 0 && (
               <div className="alert alert-warning" role="alert">
                  There isn't any vocabGroups
               </div>
            )}
            {vocabGroups.map(item => (
               <VocabGroup
                  key={item._id}
                  vocabGroup={item}
                  render={render}
                  setRender={setRender}
               />
            ))}
         </div>
      </div>
   );
};

export default VocabGroups;
