import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Form, Modal, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
   deleteSentenceApi,
   getSentencesApi,
   plusTrueSentenceApi,
} from '../../../api/sentence.service';
import { log } from 'console';
import { useNavigate } from 'react-router-dom';
import EditSentenceModal from '../components/EditSentenceModal';
import { SentenceTypes } from '../../../utils/constants';
import { ISentence } from '../../../interface/sentence.interface';

const SentenceDict = () => {
   const navigate = useNavigate();

   const [panel, setPanel] = useState<number>(0);
   const [again, setAgain] = useState(false);

   // Panel 0
   const [sliderCountValueMax, setSliderCountValueMax] = useState(15);
   const [sliderCountValueMin, setSliderCountValueMin] = useState(0);
   const [sliderLimitValue, setSliderLimitValue] = useState(10);
   const [limitMode, setLimitMode] = useState(false);
   const [type, setType] = useState('all');

   // Panel 1
   const [counterState, setStateCounter] = useState<number>(0);
   const [left, setLeft] = useState<number>(0);
   const [ahead, setAhead] = useState<number>(0);
   const [accurate, setAccurate] = useState<number>(0);
   const [sentences, setSentences] = useState<ISentence[]>([]);
   const [p, setP] = useState<string>('-');
   const [input, setInput] = useState<string>('');
   const audioRef = useRef<HTMLAudioElement>(null);
   const noteAudioRef = useRef<HTMLAudioElement>(null);
   const [isShowAnswerUsed, setIsShowAnswerUsed] = useState(false);
   const [matchCase, setMatchCase] = useState<boolean>(true);
   const [miss, setMiss] = useState<boolean>(false);

   // Panel 2
   const [showEditModal, setShowEditModal] = useState(false);
   const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(false);

   // finish modal
   const [showFinishModal, setShowFinishModal] = useState(false);
   const [showDeleteSentenceModal, setShowDeleteSentenceModal] =
      useState(false);

   useEffect(() => {
      if (panel === 0) return;
      const id = toast.loading('Loading...');
      getSentencesApi(
         (isOk: boolean, result) => {
            if (isOk) {
               toast.dismiss(id);
               if (result.sentences.length === 0) {
                  setPanel(0);
                  return toast.info('There is no Sentences to review');
               }
               let ss: ISentence[] = result.sentences;
               if (ss.length === 0) {
                  setPanel(0);
                  return toast.info('There is no Sentences to review');
               }
               if (limitMode) {
                  ss = ss.slice(0, sliderLimitValue);
                  setSentences(ss);
               } else {
                  setSentences(ss);
               }
               setLeft(ss.length - counterState);
               setAhead(counterState);
               if (audioRef.current) {
                  audioRef.current.src = ss[counterState].audio;
                  audioRef.current.play();
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
            { name: 'mode', value: 'dict' },
            { name: 'type', value: type },
         ],
      );
   }, [again]);

   useEffect(() => {
      if (counterState === 0 || panel === 0) return;

      // Check Finish
      if (counterState === sentences.length) {
         return setShowFinishModal(true);
      } else setP('0%');

      setAccurate(0);
   }, [counterState]);

   useEffect(() => {
      if (
         panel === 1 &&
         counterState !== 0 &&
         counterState !== sentences.length
      ) {
         if (audioRef.current) {
            audioRef.current.src = sentences[counterState].audio;
            audioRef.current.play();
         }
      }
      if (panel === 2) {
         if (audioRef.current) {
            audioRef.current.src = sentences[counterState].audio;
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
      navigate('/sentences');
   };

   const againClick = () => {
      setPanel(0);
      setShowFinishModal(false);
      setAgain(!again);
   };

   const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
      let { accurate, isMissed } = calculateAccuracy(
         e.target.value,
         sentences[counterState].context,
         matchCase,
      );
      setMiss(isMissed);

      setAccurate(accurate);
      setP(`${accurate}%`);
      if (accurate === 100) {
         setInput('');
         setAhead(ahead + 1);
         setLeft(left - 1);
         setPanel(2);
         if (!isShowAnswerUsed)
            plusTrueSentenceApi(
               { sentenceId: sentences[counterState]._id, plusType: 'dict' },
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
      setP(sentences[counterState].context);
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

   const deleteSentenceClick = () => {
      deleteSentenceApi(sentences[counterState]._id, (isOk, result) => {
         const t = toast.loading('Deleting Sentence...');
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
      setShowDeleteSentenceModal(false);
      setStateCounter(counterState + 1);
      setPanel(1);
      setP('-');
   };

   const goNextClick = () => {
      setInput('')
      plusTrueSentenceApi(
         { sentenceId: sentences[counterState]._id, plusType: 'dict' },
         isOk => {
            if (!isOk) toast.error('Plus counter failed');
         },
      );
      setAhead(ahead + 1);
      setLeft(left - 1);
      setPanel(2);
   };

   const ignoreClick = () => {
      setAhead(ahead + 1);
      setLeft(left - 1);
      setPanel(2);
   };

   return (
      <div className="container">
         <div className="pt-3 col-12 col-md-8 col-lg-6">
            {panel === 0 && (
               <div className="">
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

                  <div className="d-flex justify-content-between">
                     <Form.Check
                        className="mb-1"
                        type="switch"
                        checked={matchCase}
                        onChange={e => {
                           setMatchCase(e.target.checked);
                        }}
                        label="MatchCase"
                     />

                     <Form.Check
                        className="mb-1"
                        type="switch"
                        checked={autoPlayAudio}
                        onChange={e => {
                           setAutoPlayAudio(e.target.checked);
                        }}
                        label="AutoPlay"
                     />
                  </div>

                  <label className="form-label">Type:</label>
                  <select
                     className="form-select mb-3"
                     aria-label="Default select example"
                     value={type}
                     onChange={e => {
                        if (e.target.value == 'all') return setType('all');
                        setType(e.target.value);
                     }}
                  >
                     <option value={'all'}>All Types</option>
                     {SentenceTypes.map(item => {
                        return <option value={item}>{item}</option>;
                     })}
                  </select>

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
                           Select the limit of sentences: {sliderLimitValue}
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
               <div className="">
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
                        label="Match Case"
                        checked={matchCase}
                        onChange={e => {
                           setMatchCase(e.target.checked);
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

                  {sentences[counterState]?.note && (
                     <div
                        className="alert text-dark"
                        style={{ backgroundColor: '#E9ECEF', direction: 'rtl' }}
                     >
                        {sentences[counterState] &&
                           sentences[counterState].note}
                     </div>
                  )}

                  {sentences[counterState]?.meaning && (
                     <div
                        className="alert text-dark"
                        style={{ backgroundColor: '#E9ECEF', direction: 'rtl' }}
                     >
                        {sentences[counterState] &&
                           sentences[counterState].meaning}
                     </div>
                  )}
                  {/* <button
                     className="btn btn-outline-dark w-100 mb-2"
                     onClick={clearClick}
                  >
                     Clear
                  </button> */}

                  <button
                     className="btn btn-success w-100 mb-2"
                     onClick={showAnswerClick}
                  >
                     Show Answer
                  </button>

                  <button
                     className="btn btn-primary w-100 mb-2"
                     onClick={goNextClick}
                  >
                     Go Next!
                  </button>

                  <button
                     className="btn btn-warning w-100 mb-2"
                     onClick={ignoreClick}
                  >
                     Ignore
                  </button>

                  <button
                     className="btn btn-secondary w-100 mb-2"
                     onClick={() => {setShowEditModal(true)}}
                  >
                     Edit
                  </button>
               </div>
            )}

            {panel === 2 && (
               <div className="">
                  <div className="mb-2 w-100 d-flex justify-content-between">
                     <span
                        className="badge bg-success"
                        style={{ fontSize: 20 }}
                     >
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
                        {sentences[counterState] &&
                           sentences[counterState].context}
                     </div>
                  </div>
                  
                  {sentences[counterState].note && (
                     <div className="mb-1">
                        <audio
                           hidden
                           className="mb-2 w-100 rounded-2"
                           controls
                           ref={noteAudioRef}
                           src={sentences[counterState]?.noteAudio}
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
                           {sentences[counterState] &&
                              sentences[counterState].note}
                        </div>
                     </div>
                  )}

                  {sentences[counterState].meaning && (
                     <div className="mb-1">
                        <label className="form-label">Meaning (Persian)</label>
                        <div
                           className="alert text-dark"
                           style={{
                              backgroundColor: '#E9ECEF',
                              direction: 'rtl',
                           }}
                        >
                           {sentences[counterState] &&
                              sentences[counterState].meaning}
                        </div>
                     </div>
                  )}

                  <audio
                     className="mb-2 w-100 rounded-2"
                     controls
                     ref={audioRef}
                  ></audio>
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
                        setShowDeleteSentenceModal(true);
                     }}
                  >
                     Delete
                  </button>
               </div>
            )}
         </div>

         {counterState < sentences.length && (
            <EditSentenceModal
               mode={'dict'}
               sentences={sentences}
               setSentences={setSentences}
               sentenceId={sentences[counterState]._id}
               showEditModal={showEditModal}
               setShowEditModal={setShowEditModal}
            />
         )}

         {/* Delete Modal */}
         <Modal
            show={showDeleteSentenceModal}
            onHide={() => {
               setShowDeleteSentenceModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Delete sentence: ?</Modal.Title>
            </Modal.Header>
            <Modal.Body>{sentences[counterState]?.context}</Modal.Body>
            <Modal.Footer>
               <Button
                  variant="secondary"
                  onClick={() => {
                     setShowDeleteSentenceModal(false);
                  }}
               >
                  Close
               </Button>
               <Button variant="danger" onClick={deleteSentenceClick}>
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

export default SentenceDict;

const calculateAccuracy = (
   inputValue: string,
   answer: string,
   matchCase: boolean,
) => {
   if (!matchCase) {
      inputValue = inputValue.toLowerCase();
      answer = answer.toLowerCase();
   }

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
