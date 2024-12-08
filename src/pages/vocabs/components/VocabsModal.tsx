import { useEffect, useRef, useState } from 'react';
import { IAddVocab, IVocab } from '../../../interface/vocab.interface';
import { addVocabToVocabApi, getVocabApi } from '../../../api/vocab.service';
import { toast } from 'react-toastify';
import { Form, ListGroup, Modal } from 'react-bootstrap';
import VocabItem from './VocabItem';
// import VocabItem from './VocabItem';

const VocabsModal = props => {
   const {
      vocabId,
      vocab,
      showVocabsModal,
      setShowVocabsModal,
      setShowEditModal,
      vocabs,
      render,
      setRender,
      localRender,
      setLocalRender,
   } = props;

   const [addVocab, setAddVocab] = useState<IAddVocab>({
      title: '',
      meaning: '',
   });

   const addVocabClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      e.preventDefault();
      const id = toast.loading('Adding Vocab...');
      addVocabToVocabApi(
         {
            vocabId,
            title: addVocab.title,
            meaning: addVocab.meaning,

            translateApi: addVocab.translateApi,
         },
         (isOk, result) => {
            if (isOk) {
               setRender(!render);
               setLocalRender(!localRender);
               setAddVocab({ title: '', meaning: '' });
               toast.update(id, {
                  render: 'vocab added successfully',
                  type: 'success',
                  isLoading: false,
                  autoClose: 2000,
               });
            } else {
               toast.update(id, {
                  render: result.response.data.message,
                  type: 'error',
                  isLoading: false,
                  autoClose: 2000,
               });
            }
         },
      );
   };

   return (
      <Modal
         show={showVocabsModal}
         onHide={() => {
            setShowVocabsModal(false);
            setShowEditModal(true);
         }}
      >
         <Modal.Header closeButton>
            <Modal.Title>{vocab.title}</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <div className="col-12">
               <div className="mb-3">
                  <label className="form-label">Context (*required)</label>
                  <textarea
                     className="form-control"
                     onChange={e => {
                        setAddVocab({ ...addVocab, title: e.target.value });
                     }}
                     value={addVocab.title}
                     rows={1}
                  />
               </div>
               <div className="mb-3">
                  <label className="form-label">Meaning (persian)</label>
                  <textarea
                     className="form-control"
                     onChange={e => {
                        setAddVocab({ ...addVocab, meaning: e.target.value });
                     }}
                     value={addVocab.meaning}
                     rows={1}
                  />
               </div>
               <Form.Check
                  className="mb-2"
                  type="switch"
                  onChange={e => {
                     setAddVocab({
                        ...addVocab,
                        translateApi: e.target.checked,
                     });
                  }}
                  checked={addVocab.translateApi}
                  label="Translate Api"
               />
               <button
                  type="button"
                  className="btn btn-primary btn-lg w-100 add-btn mb-3"
                  onClick={addVocabClick}
               >
                  Add Vocab
               </button>
               <div className="col-12">
                  <ListGroup as="ol">
                     {vocabs.map(item => (
                        <VocabItem
                           vocab={item}
                           vocabId={vocabId}
                           key={item._id}
                           render={render}
                           setRender={setRender}
                           localRender={localRender}
                           setLocalRender={setLocalRender}
                        />
                     ))}
                  </ListGroup>
               </div>
            </div>
         </Modal.Body>
      </Modal>
   );
};

export default VocabsModal;
