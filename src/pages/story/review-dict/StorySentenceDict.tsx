import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Form, Modal, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
   deleteSentenceApi,
   getSentencesApi,
   plusTrueSentenceApi,
} from '../../../api/sentence.service';
import { log } from 'console';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SentenceTypes } from '../../../utils/constants';
import { ISentence } from '../../../interface/sentence.interface';
import { getStoryApi } from '../../../api/story.service';
import { IStory } from '../../../interface/story.interface';
import EditSentenceModal from './EditSentenceModal';

const StorySentenceDict = () => {
   const navigate = useNavigate();
   const { storyId } = useParams();

   const [panel, setPanel] = useState<number>(0);
   const [again, setAgain] = useState(false);

   // Panel 0
   const [sliderFrom, setSliderFrom] = useState(1);
   const [sliderTo, setSliderTo] = useState(0);
   const [story, setStory] = useState<IStory>({
      title: '',
      sentences: [],
   });
   const [storyLength, setStoryLength] = useState<number>(0);
   const [flagD, setFlagD] = useState({ from: 0, to: 0 });
   const [flags, setFlags] = useState<any[]>([{ context: '', index: 0 }]);
   const [answer, setAnswer] = useState<string>('');

   // Panel 1
   const [counterState, setCounterState] = useState<number>(0);
   const [left, setLeft] = useState<number>(0);
   const [ahead, setAhead] = useState<number>(0);
   const [accurate, setAccurate] = useState<number>(0);
   const [sentences, setSentences] = useState<ISentence[]>([]);
   const [input, setInput] = useState<string>('');
   const noteAudioRef = useRef<HTMLAudioElement>(null);
   const [isShowAnswerUsed, setIsShowAnswerUsed] = useState(false);
   const [matchCase, setMatchCase] = useState<boolean>(true);
   const [miss, setMiss] = useState<boolean>(false);
   const [p, setP] = useState<string>('-');
   const audioRef = useRef<HTMLAudioElement>(null);
   const [autoPlayAudio1, setAutoPlayAudio1] = useState<boolean>(false);

   // Panel 2
   const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(true);
   const [showEditModal, setShowEditModal] = useState(false);

   // finish modal
   const [showFinishModal, setShowFinishModal] = useState(false);
   const [showDeleteSentenceModal, setShowDeleteSentenceModal] =
      useState(false);

   useEffect(() => {
      getStoryApi(storyId, (isOk, result) => {
         if (isOk) {
            if (result.story.sentences.length === 0) {
               setPanel(0);
               return toast.info('There is no Sentences to review');
            }
            setStory(result.story);
            setSentences(result.story.sentences);
            setSliderTo(result.story.sentences.length);
            setStoryLength(result.story.sentences.length);
            let flagsTs = calculateFlags(result.story.sentences);
            setFlags(flagsTs);
            if (flagsTs.length > 0)
               setFlagD({ from: 0, to: flagsTs[flagsTs.length - 1].index });
         } else toast.error(result.message);
      });
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
         // counterState !== 0 &&
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
      clearClick();
      let ss: any[] = sentences.slice(sliderFrom - 1, sliderTo);
      setSentences(ss);
      setLeft(ss.length - counterState);
      setAhead(counterState);
      if (audioRef.current) {
         audioRef.current.src = ss[counterState].audio;
      }
      setPanel(1);
   };

   const reviewToughs = () => {
      clearClick();
      let ss: any[] = story.toughs;
      setStoryLength(ss.length);
      setSentences(ss);
      setLeft(ss.length - counterState);
      setAhead(counterState);
      if (audioRef.current) {
         audioRef.current.src = ss[counterState].audio;
      }
      setPanel(1);
   };

   const reviewFlags = () => {
      if (flagD.from >= flagD.to) return toast.warn('Control your entries');
      let ss: any[] = sentences.slice(flagD.from, flagD.to + 1);
      setStoryLength(ss.length);
      setSentences(ss);
      setLeft(ss.length - counterState);
      setAhead(counterState);
      if (audioRef.current) {
         audioRef.current.src = ss[counterState].audio;
      }
      setPanel(1);
   };

   const handleModalClose = () => {
      setShowFinishModal(false);
      setPanel(0);
      navigate('/stories');
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
      setCounterState(counterState + 1);
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
      setCounterState(counterState + 1);
      setPanel(1);
      setP('-');
   };

   const calculateFlags = (sentences: ISentence[]) => {
      let tt: any[] = [];
      sentences.forEach((item, index) => {
         if (item.storyFlag === true) {
            tt.push({ context: item.context, index });
         }
      });
      return tt;
   };

   const goNextClick = () => {
      setInput('')
      setAhead(ahead + 1);
      setLeft(left - 1);
      setPanel(2);
   };

   return (
      <div className="container">
         <div className="pt-3 col-12 col-md-8 col-lg-6">
            {panel === 0 && (
               <div>
                  <div className="d-flex justify-content-between pt-2">
                     <label className="form-label">
                        Length Of Story: {sentences.length}
                     </label>
                     <div>
                        <Link
                           to={`/stories/show/${story._id}`}
                           className="btn"
                           style={{ color: '#fff', backgroundColor: '#198754' }}
                        >
                           <i className="bi bi-eye" />
                        </Link>
                        <Link
                           to={`/stories/edit/${story._id}`}
                           className="btn my-1 mx-1"
                           style={{ color: '#fff', backgroundColor: 'orange' }}
                        >
                           <i className="bi bi-pen" />
                        </Link>
                        <Link
                           to={`/stories/review/${story._id}`}
                           className="btn my-1 text-light bg-primary"
                        >
                           <i className="bi bi-arrow-repeat" />
                        </Link>
                     </div>
                  </div>

                  <label className="form-label">From: {sliderFrom}</label>
                  <input
                     type="range"
                     className="form-range mb-2"
                     min={1}
                     max={storyLength}
                     value={sliderFrom}
                     onChange={e => {
                        setSliderFrom(Number(e.target.value));
                     }}
                  ></input>
                  <label className="form-label w-100">To: {sliderTo}</label>
                  <input
                     type="range"
                     className="form-range mb-2"
                     min={1}
                     max={storyLength}
                     value={sliderTo}
                     onChange={e => {
                        setSliderTo(Number(e.target.value));
                     }}
                  ></input>
                  <Form.Check
                     type="switch"
                     className="mb-2"
                     label="Auto Play"
                     checked={autoPlayAudio1}
                     onChange={e => {
                        setAutoPlayAudio1(e.target.checked);
                     }}
                  />
                  <button
                     className="btn btn-primary w-100"
                     onClick={startClick}
                  >
                     Start
                  </button>
                  <hr />
                  <button
                     className="btn btn-danger w-100"
                     onClick={reviewToughs}
                  >
                     Review Toughs
                  </button>
                  {flags.length > 0 && (
                     <div>
                        <hr />
                        {flags.map((item, index) => (
                           <div className="mb-1">
                              <i
                                 className="bi bi-flag-fill"
                                 style={{
                                    color: '#fc4b08',
                                 }}
                              ></i>{' '}
                              Number {index}, Index: {item.index}
                              <p>{item.context}</p>
                           </div>
                        ))}
                        <div className="row mb-3">
                           <div className="col-6">
                              <label className="form-label">From</label>
                              <select
                                 className="form-select"
                                 aria-label="Default select example"
                                 value={flagD.from}
                                 onChange={e => {
                                    setFlagD({
                                       ...flagD,
                                       from: Number(e.target.value),
                                    });
                                 }}
                              >
                                 <option value={0}>Beginning</option>
                                 {flags.map((item, index) => (
                                    <option value={item.index}>
                                       Flag: {index}
                                    </option>
                                 ))}
                              </select>
                           </div>
                           <div className="col-6">
                              <label className="form-label">To</label>
                              <select
                                 className="form-select"
                                 aria-label="Default select example"
                                 value={flagD.to}
                                 onChange={e => {
                                    setFlagD({
                                       ...flagD,
                                       to: Number(e.target.value),
                                    });
                                 }}
                              >
                                 {flags.map((item, index) => (
                                    <option value={item.index}>
                                       Flag: {index}
                                    </option>
                                 ))}
                                 <option value={story.sentences.length}>
                                    End
                                 </option>
                              </select>
                           </div>
                        </div>
                        <button
                           className="btn w-100"
                           style={{ color: '#fff', backgroundColor: '#fc4b08' }}
                           onClick={reviewFlags}
                        >
                           Review Flags
                        </button>
                     </div>
                  )}
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
                        <Badge
                           bg="danger"
                           style={{
                              height: 30,
                              fontSize: 15,
                              transition: '0.3ms',
                           }}
                        >
                           Missed Character
                        </Badge>
                     ) : (
                        <Badge bg="success" style={{ height: 20 }}>
                           Go on...
                        </Badge>
                     )}
                  </div>

                  {sentences[counterState]?.meaning && (
                     <div
                        className="alert text-dark"
                        style={{ backgroundColor: '#E9ECEF', direction: 'rtl' }}
                     >
                        {sentences[counterState] &&
                           sentences[counterState].meaning}
                     </div>
                  )}
                  <button
                     className="btn btn-outline-dark w-100 mb-2"
                     onClick={clearClick}
                  >
                     Clear
                  </button>

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

         {counterState < storyLength && (
            <EditSentenceModal
               storyId={storyId}
               sentenceId={sentences[counterState]._id}
               sentences={sentences}
               setSentences={setSentences}
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

export default StorySentenceDict;

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
