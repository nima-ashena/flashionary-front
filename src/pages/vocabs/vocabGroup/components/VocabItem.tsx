import { useRef, useState } from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { deleteVocabOfVocabGroupApi } from '../../../../api/vocabGroup.service';
import { useNavigate } from 'react-router-dom';
import { IVocab } from '../../../../interface/vocab.interface';

const VocabItem = (props: any) => {
   const item: IVocab = props.item;
   const type = props.type;
   const vocabGroupId = props.vocabGroupId;
   const vocabId = props.vocabId;
   const render = props.render;
   const setRender = props.setRender;
   const audioRef = useRef<HTMLAudioElement>(null);

   const [show, setShow] = useState(false);

   const navigate = useNavigate();

   const trashClick = () => {
      setShow(false);
      deleteVocabOfVocabGroupApi(
         { vocabGroupId, vocabId: item._id },
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
         <ListGroup.Item as="li" className="">
            <div className="row">
               <div className="col-12 col-md-8 col-lg-9">
                  <div className="fw-bold mb-2">{item.title}</div>
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
                        navigate(`/vocabs/edit/${item._id}`);
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
               <Modal.Title>Delete Vocab: ?</Modal.Title>
            </Modal.Header>
            <Modal.Body>{item.title}</Modal.Body>
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

export default VocabItem;
