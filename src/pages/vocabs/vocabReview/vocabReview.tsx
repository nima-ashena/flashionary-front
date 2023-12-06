import { useEffect, useRef, useState } from 'react';
import { IVocab } from '../../../interface/vocab.interface';
import { Button, Form, Modal, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
   deleteVocabApi,
   getVocabsApi,
   plusTrueVocabApi,
} from '../../../api/vocab.service';
import { log } from 'console';
import { useNavigate } from 'react-router-dom';
import SentenceItemVocab from './SentenceItem';
import EditVocabModal from './EditVocabModal';
import './style.css';

const VocabReview = () => {
   const [isFlipped, setFlipped] = useState(false);

   const handleFlip = () => {
      setFlipped(!isFlipped);
   };

   const [left, setLeft] = useState<number>(0);
   const [ahead, setAhead] = useState<number>(0);

   const nextClick = () => {};

   return (
      <div className="container">
         <div className="pt-3 col-12 col-md-8 col-lg-6">
            <div className="mb-2 w-100 d-flex justify-content-between">
               <span className="badge bg-success" style={{ fontSize: 20 }}>
                  ahead
               </span>
               <span className="badge bg-danger" style={{ fontSize: 20 }}>
                  left
               </span>
            </div>

            <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
               <div className="flip-card-inner mb-2" style={{height: '70vh'}}>
                  <div className="flip-card-front">
                     <div className="card-content">cardFront</div>
                  </div>
                  <div className="flip-card-back">
                     <div className="card-content">cardBack</div>
                  </div>
               </div>
            </div>

            <div>
               <button
                  className="btn btn-success w-100 mb-2"
                  onClick={handleFlip}
               >
                  Next!
               </button>
            </div>
         </div>
      </div>
   );
};

export default VocabReview;

const calculateAccuracy = (inputValue: string, answer: string) => {
   inputValue = inputValue.toLowerCase();
   answer = answer.toLowerCase();

   let n = 0;
   for (let i = 0; i < answer.length; i++) {
      if (answer[i] === inputValue[i]) {
         n++;
      }
   }
   return Math.round((n / answer.length) * 100);
};
