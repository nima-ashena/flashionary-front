import { useRef, useState } from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { deleteSentenceOfVocabApi } from '../../../api/vocab.service';
import EditSentenceModal from './EditSentenceModal';
import { ISentence } from '../../../interface/sentence.interface';

const SentenceItem = (props: any) => {
   const sentence: ISentence = props.sentence;
   const vocabId = props.vocabId;
   const render = props.render;
   const setRender = props.setRender;
   const localRender = props.localRender;
   const setLocalRender = props.setLocalRender;
   const audioRef = useRef<HTMLAudioElement>(null);

   const [show, setShow] = useState(false);
   const [showEditModal, setShowEditModal] = useState(false);

   const trashClick = () => {
      setShow(false);
      deleteSentenceOfVocabApi(
         { vocabId, sentenceId: sentence._id },
         (isOk, result) => {
            if (isOk) {
               // setRender(!render);
               setLocalRender(!localRender)
               toast.success(result.message);
            } else {
               toast.error(result.response.data.message);
            }
         },
      );
   };

   return (
      <>
         <ListGroup.Item as="li" className="">
            <div className="row">
               <div className="col-12 col-md-8 col-lg-9">
                  <div className="fw-bold mb-2">{sentence.context}</div>
                  <div
                     className="fw-bold mb-2"
                     style={{ direction: 'rtl', textAlign: 'right' }}
                  >
                     {sentence.meaning}
                  </div>
                  <audio
                     hidden
                     className="mb-2 w-100"
                     controls
                     src={`${sentence.audio}`}
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
                     onClick={() => setShow(true)}
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

         <EditSentenceModal
            render={render}
            setRender={setRender}
            sentenceId={sentence._id}
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
         />
         <Modal
            show={show}
            onHide={() => {
               setShow(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Delete Sentence: ?</Modal.Title>
            </Modal.Header>
            <Modal.Body>{sentence.context}</Modal.Body>
            <Modal.Footer>
               <Button
                  variant="secondary"
                  onClick={() => {
                     setShow(false);
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

export default SentenceItem;
