import { useRef, useState } from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap';


const SentenceItemVocab = (props: any) => {
   const item = props.item;
   const audioRef = useRef<HTMLAudioElement>(null);

   return (
      <>
         <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start"
         >
            <div className="ms-2 me-auto">
               <div className="fw-bold mb-2">{item.context}</div>
               <audio
                  hidden
                  className="mb-2 w-100"
                  controls
                  src={`${item.audio}`}
                  ref={audioRef}
               ></audio>
            </div>
            <button
               type="button"
               className="btn btn-secondary m-1"
               onClick={() => {
                  audioRef.current?.play();
               }}
            >
               <i className="bi bi-play" />
            </button>
         </ListGroup.Item>
      </>
   );
};

export default SentenceItemVocab;
