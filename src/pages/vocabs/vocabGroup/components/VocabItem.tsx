import { useRef, useState } from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { deleteVocabOfVocabGroupApi } from '../../../../api/vocabGroup.service';
import { useNavigate } from 'react-router-dom';
import { IVocab } from '../../../../interface/vocab.interface';
import EditVocabModal from '../../components/EditVocabModal';

const VocabItem = (props: any) => {
   const vocab: IVocab = props.vocab;
   const vocabGroupId = props.vocabGroupId;
   const render = props.render;
   const setRender = props.setRender;

   const audioRef = useRef<HTMLAudioElement>(null);
   const [showEditModal, setShowEditModal] = useState(false);

   const [showDeleteModal, setShowDeleteModal] = useState(false);

   const navigate = useNavigate();

   const trashClick = () => {
      setShowDeleteModal(false);
      deleteVocabOfVocabGroupApi(
         { vocabGroupId, vocabId: vocab._id },
         (isOk, result) => {
            if (isOk) {
               setRender(!render);
               toast.success(result.message);
            } else {
               console.log(result);
               toast.error(result.response.data.message);
            }
         },
      );
   };

   return (
      <>
         <ListGroup.Item key={vocab._id} as="li" className="">
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
                        // navigate(`/vocabs/edit/${vocab._id}`);
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
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            render={render}
            setRender={setRender}
            vocabId={vocab._id}
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
