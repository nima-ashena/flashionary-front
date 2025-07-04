import { useEffect, useRef, useState } from 'react';
import { IVocab } from '../../../../interface/vocab.interface';
import { Button, Form, Modal, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
   deleteVocabApi,
   getVocabsApi,
   plusTrueVocabApi,
} from '../../../../api/vocab.service';
import { useNavigate } from 'react-router-dom';
import EditVocabModal from '../components/EditVocabModal';
import './style.css';
import { ISentence } from '../../../../interface/sentence.interface';
import { compoundTypes } from '../../../../utils/constants';

const VocabReview = () => {
   const navigate = useNavigate();

   const [isFlipped, setFlipped] = useState(false);
   const [panel, setPanel] = useState<number>(0);
   const [reviewPanel, setReviewPanel] = useState<number>(0);
   const [again, setAgain] = useState(false);

   // Panel 0
   const [sliderCountValueMax, setSliderCountValueMax] = useState(15);
   const [sliderCountValueMin, setSliderCountValueMin] = useState(0);
   const [sliderLimitValue, setSliderLimitValue] = useState(10);
   const [compoundType, setCompoundType] = useState('all');
   const [limitMode, setLimitMode] = useState(false);
   const [reverseMode, setReverseMode] = useState(false);

   // Panel 1
   const [counterState, setStateCounter] = useState<number>(0);
   const [left, setLeft] = useState<number>(0);
   const [ahead, setAhead] = useState<number>(0);
   const [vocabs, setVocabs] = useState<IVocab[]>([]);
   const audioRef = useRef<HTMLAudioElement>(null);
   const noteAudioRef = useRef<HTMLAudioElement>(null);

   // Panel 2
   const [hidden, setHidden] = useState(false);
   const [showEditModal, setShowEditModal] = useState(false);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(true);
   // finish modal
   const [showFinishModal, setShowFinishModal] = useState(false);

   const startClick = () => {
      setStateCounter(0);
      setPanel(1);
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
                  setReviewPanel(1);
                  audioRef.current.onended = () => {};
               }
            } else {
               toast.error(result.message);
            }
         },
         [
            { name: 'trueGuessLimitMax', value: sliderCountValueMax },
            { name: 'trueGuessLimitMin', value: sliderCountValueMin },
            { name: 'sort', value: 'reviewTrueGuessCount' },
            { name: 'user', value: localStorage.getItem('userId') },
            { name: 'reviewMode', value: true },
            { name: 'compoundType', value: compoundType },
            { name: 'vocabGroup', value: 'free' },
         ],
      );
   }, [again]);

   useEffect(() => {
      if (counterState === 0 || panel === 0) return;

      // Check Finish
      if (counterState === vocabs.length) {
         return setShowFinishModal(true);
      }
   }, [counterState]);

   useEffect(() => {
      if (!reverseMode) {
         if (reviewPanel === 1 && counterState !== vocabs.length) {
            if (audioRef.current) {
               audioRef.current.src = vocabs[counterState].audio;
               audioRef.current.play();
            }
         }
         if (reviewPanel === 2) {
            if (audioRef.current) {
               audioRef.current.src = vocabs[counterState].audio;
            }
         }
      } else {
         if (
            reviewPanel === 1 &&
            counterState !== vocabs.length &&
            counterState !== 0
         ) {
            if (audioRef.current) {
               audioRef.current.src = vocabs[counterState].audio;
            }
         }
         if (reviewPanel === 2) {
            if (audioRef.current) {
               audioRef.current.src = vocabs[counterState].audio;
               audioRef.current.play();
            }
         }
      }
   }, [reviewPanel]);

   const showAnswer = () => {
      setHidden(false);
      setReviewPanel(2);
      setFlipped(!isFlipped);
   };

   const againClick = () => {
      setReviewPanel(1);
      setFlipped(!isFlipped);
      setStateCounter(counterState + 1);
      setAhead(ahead + 1);
      setLeft(left - 1);
   };

   const nextClick = () => {
      setHidden(true);
      setReviewPanel(1);
      setFlipped(!isFlipped);
      setAhead(ahead + 1);
      setLeft(left - 1);
      plusTrueVocabApi(
         { vocabId: vocabs[counterState]._id, plusType: 'review' },
         (isOk, result) => {
            if (!isOk) {
               toast.error('Plus counter failed');
               console.log(result);
            }
         },
      );
      setStateCounter(counterState + 1);
   };

   const reviewAgainClick = () => {
      setPanel(0);
      setReviewPanel(0);
      setShowFinishModal(false);
      setAgain(!again);
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
         setShowDeleteModal(false);
         setReviewPanel(1);
         setStateCounter(counterState + 1);
         setLeft(left - 1);
      });
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
                  <div className="mb-3">
                     <label className="form-label">Compound Type</label>
                     <select
                        className="form-select"
                        aria-label="Default select example"
                        value={compoundType}
                        onChange={e => {
                           if (e.target.value == 'all')
                              return setCompoundType('all');
                           setCompoundType(e.target.value);
                        }}
                     >
                        <option value={'all'}>All</option>
                        {compoundTypes.map(item => (
                           <option value={item}>{item}</option>
                        ))}
                     </select>
                  </div>
                  <Form.Check
                     className="mb-3"
                     type="switch"
                     checked={reverseMode}
                     onChange={e => {
                        setReverseMode(e.target.checked);
                     }}
                     label="Reverse Mode"
                  />
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
               <div>
                  <div className="mb-2 w-100 d-flex justify-content-between">
                     <span
                        className="badge bg-success"
                        style={{ fontSize: 20 }}
                     >
                        {ahead}
                     </span>
                     <div>
                        <button
                           type="button"
                           className="btn btn-success"
                           onClick={() => {
                              audioRef.current?.play();
                           }}
                        >
                           <i className="bi bi-play" />
                        </button>
                        <button
                           type="button"
                           className="btn btn-secondary mx-1"
                           onClick={() => {
                              setShowEditModal(true);
                           }}
                        >
                           <i className="bi bi-pen" />
                        </button>
                        <button
                           type="button"
                           className="btn btn-danger"
                           onClick={() => setShowDeleteModal(true)}
                        >
                           <i className="bi bi-trash" />
                        </button>
                     </div>
                     <span className="badge bg-danger" style={{ fontSize: 20 }}>
                        {left}
                     </span>
                  </div>

                  <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
                     <div
                        className="flip-card-inner mb-2"
                        style={{ height: '66vh' }}
                     >
                        <div className={`flip-card-front`}>
                           <div
                              className="card-content"
                              style={{
                                 height: '100%',
                                 display: 'flex',
                                 flexDirection: 'column',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                              }}
                           >
                              {!reverseMode && (
                                 <>
                                    <div
                                       className="alert text-dark"
                                       style={{
                                          fontSize: 20,
                                       }}
                                    >
                                       <button
                                          type="button"
                                          className="btn btn-success m-1"
                                          onClick={() => {
                                             audioRef.current?.play();
                                          }}
                                       >
                                          <i className="bi bi-play" />
                                       </button>
                                       {vocabs[counterState] &&
                                          vocabs[counterState].title}{' '}
                                    </div>
                                 </>
                              )}
                              {reverseMode && (
                                 <>
                                    <div
                                       className="alert text-dark"
                                       style={{
                                          fontSize: 20,
                                          direction: 'rtl',
                                       }}
                                    >
                                       {vocabs[counterState]?.meaning &&
                                          vocabs[counterState]?.meaning}
                                    </div>
                                    <div
                                       className="alert text-dark"
                                       style={{
                                          fontSize: 20,
                                       }}
                                    >
                                       <button
                                          type="button"
                                          className="btn btn-success m-1"
                                          onClick={() => {
                                             noteAudioRef.current?.play();
                                          }}
                                       >
                                          <i className="bi bi-play" />
                                       </button>
                                       {vocabs[counterState]?.note &&
                                          vocabs[counterState].note}
                                    </div>
                                    {vocabs[counterState]?.sentences.map(
                                       item => {
                                          return (
                                             <SentenceItemReview
                                                sentence={item}
                                             />
                                          );
                                       },
                                    )}
                                 </>
                              )}
                           </div>
                        </div>

                        <div className="flip-card-back">
                           <div
                              className="card-content"
                              style={{
                                 height: '100%',
                                 display: 'flex',
                                 flexDirection: 'column',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                              }}
                           >
                              {!reverseMode && !hidden && (
                                 <div
                                    style={{
                                       overflow: 'scroll',
                                       height: '100%',
                                    }}
                                 >
                                    <div
                                       className="alert text-dark"
                                       style={{
                                          fontSize: 20,
                                          marginBottom: 0,
                                          paddingTop: 0,
                                          paddingBottom: 0,
                                       }}
                                    >
                                       {vocabs[counterState]?.title &&
                                          vocabs[counterState]?.title}
                                    </div>
                                    <div
                                       className="alert text-dark"
                                       style={{
                                          fontSize: 20,
                                          direction: 'rtl',
                                       }}
                                    >
                                       {vocabs[counterState]?.meaning &&
                                          vocabs[counterState]?.meaning}
                                    </div>
                                    <div
                                       className="alert text-dark"
                                       style={{
                                          fontSize: 20,
                                       }}
                                    >
                                       <button
                                          type="button"
                                          className="btn btn-success m-1"
                                          onClick={() => {
                                             noteAudioRef.current?.play();
                                          }}
                                       >
                                          <i className="bi bi-play" />
                                       </button>
                                       {vocabs[counterState]?.note &&
                                          vocabs[counterState].note}
                                    </div>
                                    {vocabs[counterState]?.sentences.map(
                                       item => {
                                          return (
                                             <SentenceItemReview
                                                sentence={item}
                                             />
                                          );
                                       },
                                    )}
                                 </div>
                              )}
                              {reverseMode && !hidden && (
                                 <div
                                    className="alert text-dark"
                                    style={{
                                       fontSize: 20,
                                    }}
                                 >
                                    {vocabs[counterState] &&
                                       vocabs[counterState].title}{' '}
                                    <button
                                       type="button"
                                       className="btn btn-lg btn-success m-1"
                                       onClick={() => {
                                          audioRef.current?.play();
                                       }}
                                    >
                                       <i className="bi bi-play" />
                                    </button>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                     <audio
                        hidden
                        className="mb-2 w-100 rounded-2"
                        controls
                        ref={audioRef}
                     ></audio>
                     <audio
                        hidden
                        className="mb-2 w-100 rounded-2"
                        controls
                        ref={noteAudioRef}
                        src={vocabs[counterState]?.noteAudio}
                     ></audio>
                  </div>
               </div>
            )}
            <div>
               {reviewPanel === 1 && (
                  <button
                     style={{ fontSize: 18, padding: '10px 0 10px 0' }}
                     className="btn btn-primary w-100 mb-2"
                     onClick={showAnswer}
                  >
                     Show Answer
                  </button>
               )}
               {reviewPanel === 2 && (
                  <div className="row">
                     <div className="col-6" style={{ paddingRight: 2 }}>
                        <button
                           style={{
                              fontSize: 18,
                              width: '100%',
                              padding: '10px 0 10px 0',
                           }}
                           className="btn btn-danger mb-2"
                           onClick={againClick}
                        >
                           Again
                        </button>
                     </div>
                     <div className="col-6" style={{ paddingLeft: 2 }}>
                        <button
                           style={{
                              fontSize: 18,
                              width: '100%',
                              padding: '10px 0 10px 0',
                           }}
                           className="btn btn-success mb-2"
                           onClick={nextClick}
                        >
                           Next
                        </button>
                     </div>
                  </div>
               )}
            </div>
         </div>

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
         {counterState < vocabs.length && (
            <Modal
               show={showDeleteModal}
               onHide={() => {
                  setShowDeleteModal(false);
               }}
            >
               <Modal.Header closeButton>
                  <Modal.Title>Delete Vocab: ?</Modal.Title>
               </Modal.Header>
               <Modal.Body>{vocabs[counterState]?.title}</Modal.Body>
               <Modal.Footer>
                  <Button
                     style={{ width: '47%' }}
                     variant="secondary"
                     onClick={() => {
                        setShowDeleteModal(false);
                     }}
                  >
                     Close
                  </Button>
                  <Button
                     style={{ width: '47%' }}
                     variant="danger"
                     onClick={deleteVocabClick}
                  >
                     Yes
                  </Button>
               </Modal.Footer>
            </Modal>
         )}

         {/* Finish Modal */}
         <Modal
            show={showFinishModal}
            onHide={() => {
               setShowFinishModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>
                  Review done. Do you want to do it again?
               </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
               <Button
                  style={{ width: '48%' }}
                  variant="secondary"
                  onClick={() => {
                     setShowFinishModal(false);
                     navigate('/vocabs');
                  }}
               >
                  No
               </Button>
               <Button
                  style={{ width: '48%' }}
                  variant="primary"
                  onClick={reviewAgainClick}
               >
                  Yes
               </Button>
            </Modal.Footer>
         </Modal>
      </div>
   );
};

export default VocabReview;

const SentenceItemReview = (props: any) => {
   const sentence: ISentence = props.sentence;
   const audioRef = useRef<HTMLAudioElement>(null);

   useEffect(() => {
      audioRef.current.src = sentence.audio;
   }, []);

   return (
      <div
         className="alert text-dark"
         style={{
            fontSize: 18,
         }}
      >
         <button
            type="button"
            className="btn btn-info m-1"
            onClick={() => {
               audioRef.current?.play();
            }}
         >
            <i className="bi bi-play" />
         </button>
         {sentence.context}{' '}
         <audio
            hidden
            className="mb-2 w-100 rounded-2"
            controls
            ref={audioRef}
         ></audio>
      </div>
   );
};
