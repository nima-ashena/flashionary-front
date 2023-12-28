import { useRef, useState } from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';
import Vocab from '../../vocabs/Vocab';
import { IVocab } from '../../../interface/vocab.interface';
import EditVocabModal from './EditVocabModal';

const VocabItem = (props: any) => {
   const vocab: IVocab = props.vocab;
   const vocabId = props.vocabId;
   const render = props.render;
   const setRender = props.setRender;

   const audioRef = useRef<HTMLAudioElement>(null);

   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [showEditModal, setShowEditModal] = useState(false);

   const trashClick = () => {
      setShowDeleteModal(false);
   };

   return (
      <>
         <ListGroup.Item as="li" style={{ position: 'relative' }}>
            <div className="row">
               <div className="col-12 col-md-8 col-lg-9">
                  <div className="fw-bold mb-2">{vocab.title}</div>
                  <div
                     className="fw-bold mb-2"
                     style={{ direction: 'rtl', textAlign: 'right' }}
                  >
                     {vocab.meaning}
                  </div>
                  <audio
                     hidden
                     className="mb-2 w-100"
                     controls
                     src={`${vocab.audio}`}
                     ref={audioRef}
                  ></audio>
               </div>
               <div className="col-12 col-md-4 col-lg-3 d-flex justify-content-center align-items-start">
                  <button
                     type="button"
                     className="btn btn-secondary m-1"
                     onClick={() => {
                        setShowEditModal(true);
                     }}
                  >
                     <i className="bi bi-pen" />
                  </button>
                  <button
                     type="button"
                     className="btn btn-danger m-1"
                     onClick={() => setShowDeleteModal(true)}
                  >
                     <i className="bi bi-trash" />
                  </button>
                  <button
                     type="button"
                     className="btn btn-success m-1"
                     onClick={() => {
                        audioRef.current?.play();
                     }}
                  >
                     <i className="bi bi-play" />
                  </button>
               </div>
            </div>
         </ListGroup.Item>
         <EditVocabModal
            render={render}
            setRender={setRender}
            vocabId={vocab._id}
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
         />
         {/* Delete Modal */}
         <Modal
            show={showDeleteModal}
            onHide={() => {
               setShowDeleteModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Delete Vocab: ?</Modal.Title>
            </Modal.Header>
            <Modal.Body>{vocab.title}</Modal.Body>
            <Modal.Footer>
               <Button
                  variant="secondary"
                  onClick={() => {
                     setShowDeleteModal(false);
                  }}
               >
                  Close
               </Button>
               <Button variant="danger" onClick={trashClick}>
                  Yes
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};

export default VocabItem;
