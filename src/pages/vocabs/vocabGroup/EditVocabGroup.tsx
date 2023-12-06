import { useEffect, useRef, useState } from 'react';
import {
   Badge,
   Button,
   Form,
   ListGroup,
   Modal,
   Spinner,
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
   addVocabToVocabGroupApi,
   deleteVocabGroupApi,
   deleteVocabOfVocabGroupApi,
   editVocabGroupApi,
   getVocabGroupApi,
} from '../../../api/vocabGroup.service';
import { IVocab } from '../../../interface/vocab.interface';
import { IVocabGroup } from '../../../interface/vocabGroup.interface';
// import VocabItem from '../../../components/vocab/VocabItem';
import Back from '../../../components/Back';
import VocabItem from './components/VocabItem';
import { GroupTypes } from '../../../utils/constants';

const EditVocabGroup = () => {
   const { vocabGroupId } = useParams();

   const [vocabGroup, setVocabGroup] = useState<IVocabGroup>({
      _id: '',
      title: '',
   });
   const [editedVocabGroup, setEditedVocabGroup] = useState<IVocabGroup>({
      _id: '',
      title: '',
   });
   const [translateApi, setTranslateApi] = useState<boolean>(true);
   const [vocab, setVocab] = useState<IVocab>({ title: '' });
   const [vocabs, setVocabs] = useState<IVocab[]>([]);
   const [vocabsLoading, setVocabsLoading] = useState(true);
   const [render, setRender] = useState(false);
   const [addVocabModal, setAddVocabModal] = useState(false);
   const [editVideoGroupModal, setEditVideoGroupModal] = useState(false);
   const [deleteVideoGroupModal, setDeleteVideoGroupModal] = useState(false);

   const navigate = useNavigate();

   useEffect(() => {
      setVocabsLoading(true);
      getVocabGroupApi(vocabGroupId, (isOk, result) => {
         if (isOk) {
            setVocabGroup(result.vocabGroup);
            setEditedVocabGroup(result.vocabGroup);
            setVocabs(result.vocabGroup.vocabs);
            setVocabsLoading(false);
         } else toast.error(result.message);
      });
   }, [render]);

   const addVocabClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      e.preventDefault();
      addVocabToVocabGroupApi(
         {
            vocabGroupId,
            title: vocab.title,
            meaning: vocab.meaning,
            translateApi,
         },
         (isOk, result) => {
            if (isOk) {
               setRender(!render);
               setAddVocabModal(false);
               setVocab({ title: '', meaning: '' });
            } else {
               toast.error(result.response.data.message);
            }
         },
      );
   };

   const editVocabGroupClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      e.preventDefault();
      editVocabGroupApi(
         vocabGroupId,
         {
            title: editedVocabGroup.title,
            groupKind: editedVocabGroup.groupKind,
         },
         (isOk, result) => {
            console.log(result.vocabGroup);
            if (isOk) {
               setEditVideoGroupModal(false);
               setVocabGroup(result.vocabGroup);
               toast.success('VocabGroup edited successfully');
               setRender(!render);
               // setSentences(result.vocabGroup.sentences.reverse())
            } else {
               toast.error(result.message);
            }
         },
      );
   };

   const deleteVocabGroupClick = () => {
      deleteVocabGroupApi(vocabGroupId, (isOk, result) => {
         if (isOk) {
            toast.success('VocabGroup deleted successfully');
            navigate('/vocabs/groups');
         }
      });
   };

   return (
      <div className="container">
         <div className="col-12 col-md-8 col-lg-4 mt-3">
            <div className="d-flex justify-content-between mb-2">
               <Back url={'/vocabs/groups'} />
               <i
                  onClick={() => {
                     setEditVideoGroupModal(true);
                  }}
                  className="bi bi-gear-fill mx-1"
                  style={{ fontSize: 30, margin: 0, cursor: 'pointer' }}
               ></i>
            </div>
            <div className="mb-3">
               <label className="form-label">VocabGroup Title</label>
               <input
                  type="text"
                  className="form-control"
                  // onChange={e => {
                  //    setVocabGroup({ ...vocabGroup, title: e.target.value });
                  // }}
                  value={vocabGroup.title}
                  disabled
               />
            </div>
            <div className="mb-3">
               <label className="form-label">Type</label>
               <input
                  type="text"
                  className="form-control"
                  // onChange={e => {
                  //    setVocabGroup({ ...vocabGroup, title: e.target.value });
                  // }}
                  value={vocabGroup.groupKind}
                  disabled
               />
            </div>
            <button
               className="btn btn-secondary w-100"
               onClick={() => {
                  setAddVocabModal(true);
               }}
            >
               Add Vocab
            </button>
         </div>
         <div className="row mb-3">
            <div className="col-12 col-lg-8 mt-3">
               {vocabsLoading && (
                  <Button className="w-100 py-3" variant="secondary" disabled>
                     <Spinner
                        className="mx-2"
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                     />
                     Loading...
                  </Button>
               )}
               <ListGroup as="ol">
                  {vocabs.map(vocab => (
                     <VocabItem
                        vocab={vocab}
                        render={render}
                        setRender={setRender}
                        vocabGroupId={vocabGroupId}
                     />
                  ))}
               </ListGroup>
            </div>
         </div>

         {/* Add Vocab Modal */}
         <Modal
            show={addVocabModal}
            onHide={() => {
               setAddVocabModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Adding: {vocab.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <div>
                  <form className="pt-3">
                     <div className="mb-3">
                        <label className="form-label">Title (*required)</label>
                        <textarea
                           className="form-control"
                           onChange={e => {
                              setVocab({ ...vocab, title: e.target.value });
                           }}
                           value={vocab.title}
                           rows={1}
                        />
                     </div>
                     <div className="mb-3">
                        <label className="form-label">Meaning</label>
                        <textarea
                           className="form-control"
                           onChange={e => {
                              setVocab({ ...vocab, meaning: e.target.value });
                           }}
                           value={vocab.meaning}
                           rows={1}
                        />
                     </div>
                     <div className="form-check mb-3">
                        <input
                           className="form-check-input"
                           type="checkbox"
                           onChange={e => {
                              setTranslateApi(e.target.checked);
                           }}
                           checked={translateApi}
                        />
                        <label className="form-check-label">
                           Translate Api
                        </label>
                     </div>
                     <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 add-btn mb-2"
                        onClick={addVocabClick}
                     >
                        Add Vocab
                     </button>
                  </form>
               </div>
            </Modal.Body>
         </Modal>

         {/* Edit Modal */}
         <Modal
            show={editVideoGroupModal}
            onHide={() => {
               setEditVideoGroupModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Edit VocabGroup </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <form className="pt-3">
                  <div className="mb-3">
                     <label className="form-label">VocabGroup Title</label>
                     <input
                        type="text"
                        className="form-control"
                        onChange={e => {
                           setEditedVocabGroup({
                              ...editedVocabGroup,
                              title: e.target.value,
                           });
                        }}
                        value={editedVocabGroup.title}
                     />
                  </div>
                  <div className="mb-3">
                     <label className="form-label">Type:</label>
                     <select
                        className="form-select mb-3"
                        aria-label="Default select example"
                        value={editedVocabGroup.groupKind}
                        onChange={e => {
                           setEditedVocabGroup({
                              ...editedVocabGroup,
                              groupKind: e.target.value,
                           });
                        }}
                     >
                        {GroupTypes.map(item => {
                           return <option value={item}>{item}</option>;
                        })}
                     </select>
                  </div>
                  <button
                     type="submit"
                     className="btn btn-secondary btn-lg w-100 add-btn mb-2"
                     onClick={editVocabGroupClick}
                  >
                     Save
                  </button>
                  <button
                     type="button"
                     className="btn btn-danger btn-lg w-100 add-btn mb-2"
                     onClick={() => {
                        setEditVideoGroupModal(false);
                        setDeleteVideoGroupModal(true);
                     }}
                  >
                     Delete VideoGroup
                  </button>
               </form>
            </Modal.Body>
         </Modal>

         <Modal
            show={deleteVideoGroupModal}
            onHide={() => {
               setDeleteVideoGroupModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Delete VocabGroup: ?</Modal.Title>
            </Modal.Header>
            <Modal.Body>{vocabGroup.title}</Modal.Body>
            <Modal.Footer>
               <Button
                  variant="secondary"
                  onClick={() => {
                     setDeleteVideoGroupModal(false);
                  }}
               >
                  Close
               </Button>
               <Button variant="danger" onClick={deleteVocabGroupClick}>
                  Yes
               </Button>
            </Modal.Footer>
         </Modal>
      </div>
   );
};

export default EditVocabGroup;
