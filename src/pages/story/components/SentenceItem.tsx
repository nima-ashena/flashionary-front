import { useRef, useState } from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { deleteSentenceOfStoryApi } from '../../../api/story.service';
import { deleteSentenceOfVocabApi } from '../../../api/vocab.service';
import { useNavigate } from 'react-router-dom';

const SentenceItem = (props: any) => {
   const item = props.item;
   const type = props.type;
   const storyId = props.storyId;
   const vocabId = props.vocabId;
   const render = props.render;
   const setRender = props.setRender;
   const audioRef = useRef<HTMLAudioElement>(null);

   const [show, setShow] = useState(false);

   const navigate = useNavigate();

   const trashClick = () => {
      setShow(false);
      if (type === 'story') {
         deleteSentenceOfStoryApi(
            { storyId, sentenceId: item._id },
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
      } else if (type === 'vocab') {
         deleteSentenceOfVocabApi(
            { vocabId, sentenceId: item._id },
            (isOk, result) => {
               if (isOk) {
                  setRender(!render);
                  toast.success(result.message);
               } else {
                  toast.error(result.response.data.message);
               }
            },
         );
      }
   };

   return (
      <>
         <ListGroup.Item as="li" className="">
            <div className="row">
               <div className="col-12 col-md-8 col-lg-9">
                  <div className="fw-bold mb-2">{item.context}</div>
                  <div
                     className="fw-bold mb-2"
                     style={{ direction: 'rtl', textAlign: 'right' }}
                  >
                     {item.meaning}
                  </div>
                  <audio
                     hidden
                     className="mb-2 w-100"
                     controls
                     src={`${item.audio}`}
                     ref={audioRef}
                  ></audio>
               </div>

               <div className="col-12 col-md-4 col-lg-3 d-flex justify-content-center align-items-start">
                  <button
                     type="button"
                     className="btn btn-secondary m-1"
                     onClick={() => {
                        navigate(`/sentences/edit/${item._id}`);
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
         <Modal
            show={show}
            onHide={() => {
               setShow(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Delete Sentence: ?</Modal.Title>
            </Modal.Header>
            <Modal.Body>{item.context}</Modal.Body>
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
