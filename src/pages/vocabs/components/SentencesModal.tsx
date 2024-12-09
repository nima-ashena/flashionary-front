import { useEffect, useRef, useState } from 'react';
import { IVocab } from '../../../interface/vocab.interface';
import { addSentenceToVocabApi, getVocabApi } from '../../../api/vocab.service';
import { toast } from 'react-toastify';
import { ListGroup, Modal } from 'react-bootstrap';
import SentenceItem from './SentenceItem';

const SentencesModal = props => {
   const {
      vocabId,
      showSentencesModal,
      setShowSentencesModal,
      setShowEditModal,
      sentences,
      render,
      setRender,
      localRender,
      setLocalRender,
   } = props;

   const [sentence, setSentence] = useState<string>(''); // context

   const addSentenceClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      e.preventDefault();
      const id = toast.loading('Adding Sentence...');
      addSentenceToVocabApi(
         {
            vocabId,
            context: sentence,
         },
         (isOk, result) => {
            if (isOk) {
               setRender(!render);
               setLocalRender(!localRender);
               setSentence('');
               toast.dismiss(id);
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
         show={showSentencesModal}
         onHide={() => {
            setShowSentencesModal(false);
            setShowEditModal(true);
         }}
      >
         <Modal.Header closeButton>
            <Modal.Title>Sentences</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <div className="col-12">
               <div className="mb-3">
                  <label className="form-label">Context (*required)</label>
                  <textarea
                     className="form-control"
                     onChange={e => {
                        setSentence(e.target.value);
                     }}
                     value={sentence}
                     rows={4}
                  />
               </div>
               <button
                  type="button"
                  className="btn btn-primary btn-lg w-100 add-btn mb-3"
                  onClick={addSentenceClick}
               >
                  Add Sentence
               </button>
               <div className="col-12">
                  <ListGroup as="ol">
                     {sentences.map(item => (
                        <SentenceItem
                           sentence={item}
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

export default SentencesModal;
