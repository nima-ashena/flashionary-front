import { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
   deleteVocabApi,
   getVocabsApi,
   plusTrueVocabApi,
} from '../../api/vocab.service';
import { IVocab } from '../../interface/vocab.interface';

const VocabDict = () => {
   const navigate = useNavigate();

   const [panel, setPanel] = useState(0);

   // Panel 0
   const [sliderValue, setSliderValue] = useState(15);
   const [hardMode, setHardMode] = useState<boolean>(false);

   // Panel 1
   const [counterState, setStateCounter] = useState<number>(0);
   const [again, setAgain] = useState(false);
   const [left, setLeft] = useState<number>(0);
   const [ahead, setAhead] = useState<number>(0);
   const [accurate, setAccurate] = useState<number>(0);
   const [vocabs, setVocabs] = useState<IVocab[]>([{ _id: '', title: '' }]);
   const [p, setP] = useState<string>('-');
   const [input, setInput] = useState<string>('');
   const audioRef = useRef<HTMLAudioElement>(null);
   const [isShowAnswerUsed, setIsShowAnswerUsed] = useState(false);

   // finish modal
   const [showModal, setShowModal] = useState(false);
   // delete modal
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const handleModalClose = () => {
      setShowModal(false);
      setPanel(0);
      navigate('/vocabs');
   };

   const againClick = () => {
      setPanel(0);
      setShowModal(false);
      setAgain(!again);
   };

   useEffect(() => {
      if (panel === 0) return;
      const id = toast.loading('Loading...');
      getVocabsApi(
         (isOk: boolean, result) => {
            if (isOk) {
               toast.dismiss(id);
               if (result.vocabs.length === 0) {
                  setPanel(0);
                  return toast.info('There is no Vocabs to review');
               }
               setVocabs(result.vocabs);
               // setAhead(0);
               setLeft(result.vocabs.length);
               if (audioRef.current) {
                  audioRef.current.src = result.vocabs[counterState].audio;
                  audioRef.current.play();
               }
            } else {
               console.log(result.message);
               toast.error(result.message);
            }
         },
         [
            { name: 'trueGuessLimit', value: sliderValue },
            { name: 'sort', value: 'true_guess_count' },
         ],
      );
   }, [again]);

   useEffect(() => {
      // Check Finish
      if (counterState === vocabs.length) {
         return setShowModal(true);
      }

      if (hardMode) setP('Hard Mode');
      else setP('0%');
      setAccurate(0);
   }, [counterState, hardMode]);

   const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
      if (hardMode) setP('Hard Mode');
      let res = calculateAccuracy(e.target.value, vocabs[counterState].title);

      setAccurate(res);
      if (!hardMode) setP(`${res}%`);
      if (res === 100) {
         setInput('');
         setAhead(ahead + 1);
         setLeft(left - 1);
         // setCounter(counter + 1);
         if (!isShowAnswerUsed)
            plusTrueVocabApi(vocabs[counterState]._id, isOk => {
               if (!isOk) toast.error('Plus counter failed');
            });
         setStateCounter(counterState + 1);
         setIsShowAnswerUsed(false);
      }
   };

   const startClick = () => {
      setPanel(1);
      setAgain(!again);
   };

   const showAnswerClick = () => {
      setIsShowAnswerUsed(true);
      setP(vocabs[counterState].title);
   };

   const deleteVocabClick = () => {
      let id = vocabs[counterState]?._id;
      deleteVocabApi(id, (isOk, result) => {
         const t = toast.loading('Deleting Vocab...');
         if (isOk) {
            toast.update(t, {
               render: 'vocab deleted successfully',
               type: 'success',
               isLoading: false,
               autoClose: 2000,
            });
            setStateCounter(counterState + 1);
            // setVocabs(vocabs.filter(item => item._id !==== id))
            // setAgain(!again)
         } else {
            console.log(result.message);
            toast.update(t, {
               render: result.message,
               type: 'error',
               isLoading: false,
               autoClose: 2000,
            });
         }
      });
   };

   return (
      <div className="container">
         {panel === 0 && (
            <div className="pt-3 col-12 col-md-8 col-lg-6">
               <label className="form-label">
                  Select count of true guess: {sliderValue}
               </label>
               <input
                  type="range"
                  className="form-range mb-2"
                  min="5"
                  max="20"
                  value={sliderValue}
                  onChange={e => {
                     setSliderValue(Number(e.target.value));
                  }}
               ></input>
               <div className="form-check form-switch ps-0 mb-3">
                  <Form.Check
                     type="switch"
                     id="custom-switch"
                     label="Hard mode"
                     checked={hardMode}
                     onChange={e => {
                        setHardMode(e.target.checked);
                     }}
                  />
               </div>
               <button className="btn btn-primary w-100" onClick={startClick}>
                  Start
               </button>
            </div>
         )}
         {panel === 1 && (
            <>
               <div className="pt-3 col-12 col-md-8 col-lg-6">
                  <div className="mb-2 w-100 d-flex justify-content-between">
                     <span
                        className="badge bg-success"
                        style={{ fontSize: 20 }}
                     >
                        {ahead}
                     </span>
                     <Form.Check
                        type="switch"
                        id="custom-switch"
                        label="Hard mode"
                        checked={hardMode}
                        onChange={e => {
                           setHardMode(e.target.checked);
                        }}
                     />
                     <span className="badge bg-danger" style={{ fontSize: 20 }}>
                        {left}
                     </span>
                  </div>
                  <audio
                     className="mb-2 w-100 rounded-2"
                     controls
                     ref={audioRef}
                  ></audio>
                  <div className="mb-3">
                     <input
                        type="text"
                        onChange={e => inputChange(e)}
                        // onChange={e => {setInput(e.target.value)}}
                        value={input}
                        className="form-control mb-2"
                        placeholder="write your answer"
                     />
                  </div>
                  {vocabs[counterState]?.meaning && (
                     <p className="" style={{ fontSize: 28 }}>
                        {vocabs[counterState].meaning}
                     </p>
                  )}
                  {!hardMode && <ProgressBar now={accurate} />}
                  <p className="" style={{ fontSize: 28 }}>
                     {p}
                  </p>
                  <button
                     className="btn btn-primary w-100"
                     onClick={showAnswerClick}
                  >
                     Show Answer
                  </button>
                  {/* <div className="d-flex justify-content-between my-2">
                     <button
                        className="btn btn-secondary w-50 me-1"
                        onClick={showAnswerClick}
                     >
                        Edit Vocab (not work)
                     </button> 
                     <button
                        className="btn btn-danger w-50"
                        onClick={() => setShowDeleteModal(true)}
                     >
                        Delete vocab (not work properly)
                     </button> 
                  </div> */}
               </div>

               {/* Modal */}
               <Modal show={showModal} onHide={handleModalClose}>
                  <Modal.Header closeButton>
                     <Modal.Title>
                        Review done. Do you want do it again?
                     </Modal.Title>
                  </Modal.Header>
                  <Modal.Footer>
                     <Button variant="secondary" onClick={handleModalClose}>
                        No
                     </Button>
                     <Button variant="primary" onClick={againClick}>
                        Yes
                     </Button>
                  </Modal.Footer>
               </Modal>

               {/* Delete Modal */}
               <Modal
                  show={showDeleteModal}
                  onHide={() => {
                     setShowDeleteModal(false);
                  }}
               >
                  <Modal.Header closeButton>
                     <Modal.Title>
                        Delete Vocab: {vocabs[counterState]?.title} ?
                     </Modal.Title>
                  </Modal.Header>
                  <Modal.Footer>
                     <Button
                        variant="secondary"
                        onClick={() => {
                           setShowDeleteModal(false);
                        }}
                     >
                        No
                     </Button>
                     <Button variant="primary" onClick={deleteVocabClick}>
                        Yes
                     </Button>
                  </Modal.Footer>
               </Modal>
            </>
         )}
      </div>
   );
};

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

export default VocabDict;
