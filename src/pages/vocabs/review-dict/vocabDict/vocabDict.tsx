import { useEffect, useRef, useState } from 'react';
import { IVocab } from '../../../../interface/vocab.interface';
import { Badge, Button, Form, Modal, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
   deleteVocabApi,
   getVocabsApi,
   plusTrueVocabApi,
} from '../../../../api/vocab.service';
import { log } from 'console';
import { useNavigate } from 'react-router-dom';
import SentenceItemVocab from './SentenceItem';
import EditVocabModal from '../components/EditVocabModal';

const VocabDict = () => {
   const navigate = useNavigate();

   const [panel, setPanel] = useState<number>(0);
   const [again, setAgain] = useState(false);

   // Panel 0
   const [sliderCountValueMax, setSliderCountValueMax] = useState(15);
   const [sliderCountValueMin, setSliderCountValueMin] = useState(0);
   const [sliderLimitValue, setSliderLimitValue] = useState(10);
   const [limitMode, setLimitMode] = useState(false);

   // Panel 1
   const [counterState, setStateCounter] = useState<number>(0);
   const [left, setLeft] = useState<number>(0);
   const [ahead, setAhead] = useState<number>(0);
   const [accurate, setAccurate] = useState<number>(0);
   const [vocabs, setVocabs] = useState<IVocab[]>([]);
   const [p, setP] = useState<string>('-');
   const [input, setInput] = useState<string>('');
   const audioRef = useRef<HTMLAudioElement>(null);
   const noteAudioRef = useRef<HTMLAudioElement>(null);
   const [isShowAnswerUsed, setIsShowAnswerUsed] = useState(false);
   const [hardMode, setHardMode] = useState<boolean>(false);
   const [miss, setMiss] = useState<boolean>(false);

   // Panel 2
   const [showEditModal, setShowEditModal] = useState(false);
   const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(true);

   // finish modal
   const [showFinishModal, setShowFinishModal] = useState(false);
   const [showDeleteVocabModal, setShowDeleteVocabModal] = useState(false);

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
               let vs: IVocab[] = result.vocabs;
               if (limitMode) {
                  vs = vs.slice(0, sliderLimitValue);
                  setVocabs(vs);
               } else {
                  setVocabs(vs);
               }
               setLeft(vs.length - counterState);
               setAhead(counterState);
               if (audioRef.current) {
                  audioRef.current.src = vs[counterState].audio;
                  audioRef.current.play();
                  audioRef.current.onended = () => {};
               }
               if (vs[counterState].dictTrueGuessCount > 5) {
                  setHardMode(true);
               }
            } else {
               toast.error(result.message);
            }
         },
         [
            { name: 'trueGuessLimitMax', value: sliderCountValueMax },
            { name: 'trueGuessLimitMin', value: sliderCountValueMin },
            { name: 'sort', value: 'dictTrueGuessCount' },
            { name: 'user', value: localStorage.getItem('userId') },
            { name: 'vocabGroup', value: 'free' },
            { name: 'dictMode', value: true },
         ],
      );
   }, [again]);

   useEffect(() => {
      if (counterState === 0 || panel === 0) return;

      // Check Finish
      if (counterState === vocabs.length) {
         return setShowFinishModal(true);
      }

      if (hardMode) setP('Hard Mode');
      else setP('0%');
      if (vocabs[counterState].dictTrueGuessCount > 5) {
         setHardMode(true);
      }
      setAccurate(0);
   }, [counterState]);

   useEffect(() => {
      if (panel === 1 && counterState !== 0 && counterState !== vocabs.length) {
         if (audioRef.current) {
            audioRef.current.src = vocabs[counterState].audio;
            audioRef.current.play();
         }
      }
      if (panel === 2) {
         if (audioRef.current) {
            audioRef.current.src = vocabs[counterState].audio;
            if (autoPlayAudio) audioRef.current.play();
         }
      }
   }, [panel]);

   const startClick = () => {
      setStateCounter(0);
      setPanel(1);
      setAgain(!again);
   };

   const handleModalClose = () => {
      setShowFinishModal(false);
      setPanel(0);
      navigate('/vocabs');
   };

   const againClick = () => {
      setPanel(0);
      setShowFinishModal(false);
      setAgain(!again);
   };

   const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
      if (hardMode) setP('Hard Mode');
      let { accurate, isMissed } = calculateAccuracy(
         e.target.value,
         vocabs[counterState].title,
      );

      setMiss(isMissed);
      setAccurate(accurate);
      if (!hardMode) setP(`${accurate}%`);
      if (accurate === 100) {
         setInput('');
         setAhead(ahead + 1);
         setLeft(left - 1);
         setPanel(2);
         if (!isShowAnswerUsed)
            plusTrueVocabApi(
               { vocabId: vocabs[counterState]._id, plusType: 'dict' },
               (isOk, result) => {
                  if (!isOk) {
                     toast.error('Plus counter failed');
                     console.log(result);
                  }
               },
            );
         setIsShowAnswerUsed(false);
      }
   };

   const showAnswerClick = () => {
      setIsShowAnswerUsed(true);
      setP(vocabs[counterState].title);
   };

   const clearClick = () => {
      setInput('');
      setP('0%');
      setAccurate(0);
   };

   const nextClick = () => {
      if (panel !== 2) return;
      setStateCounter(counterState + 1);
      setPanel(1);
   };

   const deleteVocabClick = () => {
      deleteVocabApi(vocabs[counterState]._id, (isOk, result) => {
         const t = toast.loading('Deleting Vocab...');
         if (isOk) {
            toast.dismiss(t);
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
      setShowDeleteVocabModal(false);
      setStateCounter(counterState + 1);
      setPanel(1);
      setP('-');
   };

   const goNextClick = () => {
      plusTrueVocabApi(
         { vocabId: vocabs[counterState]._id, plusType: 'dict' },
         isOk => {
            if (!isOk) toast.error('Plus counter failed');
         },
      );
      setAhead(ahead + 1);
      setLeft(left - 1);
      setPanel(2);
   };

   return (
      <div className="container">
         {panel === 0 && (
            <div className="pt-3 col-12 col-md-8 col-lg-6">
               <label className="form-label">
                  Select count of true guess (Max): {sliderCountValueMax}
               </label>
               <input
                  type="range"
                  className="form-range mb-2"
                  min="0"
                  max="20"
                  value={sliderCountValueMax}
                  onChange={e => {
                     setSliderCountValueMax(Number(e.target.value));
                  }}
               ></input>
               <label className="form-label">
                  Select count of true guess (Min): {sliderCountValueMin}
               </label>
               <input
                  type="range"
                  className="form-range mb-2"
                  min="0"
                  max="20"
                  value={sliderCountValueMin}
                  onChange={e => {
                     setSliderCountValueMin(Number(e.target.value));
                  }}
               ></input>
               <Form.Check
                  className="mb-1"
                  type="switch"
                  checked={limitMode}
                  onChange={e => {
                     setLimitMode(e.target.checked);
                  }}
                  label="Limit Mode"
               />
               {limitMode && (
                  <>
                     <label className="form-label">
                        Select the limit of vocabs: {sliderLimitValue}
                     </label>
                     <input
                        type="range"
                        className="form-range mb-2"
                        min="5"
                        max="20"
                        value={sliderLimitValue}
                        onChange={e => {
                           setSliderLimitValue(Number(e.target.value));
                        }}
                     ></input>
                  </>
               )}

               <button
                  className="btn btn-primary w-100 my-2"
                  onClick={startClick}
               >
                  Start
               </button>
            </div>
         )}

         {panel === 1 && (
            <div className="pt-3 col-12 col-md-8 col-lg-6">
               <div className="mb-2 w-100 d-flex justify-content-between">
                  <span className="badge bg-success" style={{ fontSize: 20 }}>
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
                     value={input}
                     className="form-control mb-2"
                     placeholder="write your answer"
                     autoFocus
                  />
               </div>
               {!hardMode && (
                  <>
                     <ProgressBar now={accurate} label={p} />
                     <div className="d-flex align-items-center justify-content-between">
                        <p className="" style={{ fontSize: 28 }}>
                           {p}
                        </p>
                        {miss ? (
                           <Badge bg="danger" style={{ height: 20 }}>
                              Missed Character
                           </Badge>
                        ) : (
                           <Badge bg="success" style={{ height: 20 }}>
                              Go on...
                           </Badge>
                        )}
                     </div>
                  </>
               )}

               {vocabs[counterState]?.meaning && (
                  <div
                     className="alert text-dark"
                     style={{ backgroundColor: '#E9ECEF', direction: 'rtl' }}
                  >
                     {vocabs[counterState] && vocabs[counterState].meaning}
                  </div>
               )}
               {/* <button
                  className="btn btn-secondary w-100 mb-2"
                  onClick={clearClick}
               >
                  Clear
               </button> */}
               {!hardMode && (
                  <button
                     className="btn btn-success w-100 mb-2"
                     onClick={showAnswerClick}
                  >
                     Show Answer
                  </button>
               )}
               <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={goNextClick}
               >
                  Go Next!
               </button>
            </div>
         )}

         {panel === 2 && (
            <div className="pt-3 col-12 col-md-8 col-lg-6">
               <div className="mb-2 w-100 d-flex justify-content-between">
                  <span className="badge bg-success" style={{ fontSize: 20 }}>
                     {ahead}
                  </span>
                  <Form.Check
                     type="switch"
                     className="mb-2"
                     label="Auto Play"
                     checked={autoPlayAudio}
                     onChange={e => {
                        setAutoPlayAudio(e.target.checked);
                     }}
                  />
                  <span className="badge bg-danger" style={{ fontSize: 20 }}>
                     {left}
                  </span>
               </div>

               <div style={{ marginBottom: 0 }}>
                  <label className="form-label">Title</label>
                  <div
                     className="alert text-dark"
                     style={{ backgroundColor: '#E9ECEF' }}
                  >
                     {vocabs[counterState] && vocabs[counterState].title}
                  </div>
               </div>
               {vocabs[counterState].note && (
                  <div className="mb-1">
                     <audio
                        hidden
                        className="mb-2 w-100 rounded-2"
                        controls
                        ref={noteAudioRef}
                        src={vocabs[counterState]?.noteAudio}
                     ></audio>
                     <label className="form-label">Note</label>
                     <button
                        type="button"
                        className="btn btn-success m-1"
                        onClick={() => {
                           noteAudioRef.current?.play();
                        }}
                     >
                        <i className="bi bi-play" />
                     </button>
                     <div
                        className="alert text-dark"
                        style={{ backgroundColor: '#E9ECEF' }}
                     >
                        {vocabs[counterState] && vocabs[counterState].note}
                     </div>
                  </div>
               )}
               {vocabs[counterState].meaning && (
                  <div className="mb-1">
                     <label className="form-label">Meaning (Persian)</label>
                     <div
                        className="alert text-dark"
                        style={{ backgroundColor: '#E9ECEF', direction: 'rtl' }}
                     >
                        {vocabs[counterState] && vocabs[counterState].meaning}
                     </div>
                  </div>
               )}

               <audio
                  className="mb-2 w-100 rounded-2"
                  controls
                  ref={audioRef}
               ></audio>
               {vocabs[counterState].sentences.map(item => (
                  <SentenceItemVocab item={item} key={item._id} />
               ))}
               <button
                  className="btn btn-primary w-100 mb-2 mt-2"
                  onClick={nextClick}
                  autoFocus
               >
                  Next
               </button>
               <Button
                  className="btn btn-secondary w-100 mb-2"
                  onClick={() => {
                     setShowEditModal(true);
                  }}
               >
                  Edit
               </Button>
               <button
                  className="btn btn-danger w-100 mb-2"
                  onClick={() => {
                     setShowDeleteVocabModal(true);
                  }}
               >
                  Delete
               </button>
            </div>
         )}

         {counterState < vocabs.length && (
            <EditVocabModal
               vocabs={vocabs}
               setVocabs={setVocabs}
               vocabId={vocabs[counterState]._id}
               showEditModal={showEditModal}
               setShowEditModal={setShowEditModal}
            />
         )}

         {/* Delete Modal */}
         <Modal
            show={showDeleteVocabModal}
            onHide={() => {
               setShowDeleteVocabModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Delete vocab: ?</Modal.Title>
            </Modal.Header>
            <Modal.Body>{vocabs[counterState]?.title}</Modal.Body>
            <Modal.Footer>
               <Button
                  variant="secondary"
                  onClick={() => {
                     setShowDeleteVocabModal(false);
                  }}
               >
                  Close
               </Button>
               <Button variant="danger" onClick={deleteVocabClick}>
                  Yes
               </Button>
            </Modal.Footer>
         </Modal>

         {/* Finish Modal */}
         <Modal show={showFinishModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
               <Modal.Title>
                  Review done. Do you want to do it again?
               </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
               <Button
                  style={{ width: '48%' }}
                  variant="secondary"
                  onClick={handleModalClose}
               >
                  No
               </Button>
               <Button
                  style={{ width: '48%' }}
                  variant="primary"
                  onClick={againClick}
               >
                  Yes
               </Button>
            </Modal.Footer>
         </Modal>
      </div>
   );
};

export default VocabDict;

const calculateAccuracy = (inputValue: string, answer: string) => {
   let n = 0;
   let isMissed = true;
   for (let i = 0; i < answer.length; i++) {
      if (answer[i] === inputValue[i]) {
         n++;
      }
   }
   if (inputValue.length == n) isMissed = false;
   return {
      accurate: Math.round((n / answer.length) * 100),
      isMissed,
   };
};
