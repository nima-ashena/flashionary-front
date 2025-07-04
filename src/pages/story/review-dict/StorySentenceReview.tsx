import { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
   deleteSentenceApi,
   getSentencesApi,
} from '../../../api/sentence.service';
import { getStoryApi } from '../../../api/story.service';
import { ISentence } from '../../../interface/sentence.interface';
import { IStory } from '../../../interface/story.interface';
import { shuffleArray } from '../../../utils/utils';
import SentenceItem from '../../sentences/replacement/SentenceItem';
import { SentenceTypes } from '../../../utils/constants';
import EditSentenceModal from './EditSentenceModal';

const StorySentenceReview = () => {
   const navigate = useNavigate();

   const { storyId } = useParams();
   const [sentences, setSentences] = useState<ISentence[]>([
      { _id: '', context: '' },
   ]);

   // start panel is zero (0)
   const [panel, setPanel] = useState(0);
   const [counterState, setStateCounter] = useState<number>(0);
   const [left, setLeft] = useState<number>(0);
   const [ahead, setAhead] = useState<number>(0);
   const [clear, setClear] = useState(false);

   // Panel 0
   const [sliderFrom, setSliderFrom] = useState(1);
   const [sliderTo, setSliderTo] = useState(0);
   const [sentenceItems, setSentenceItems] = useState<any[]>([]);
   const [answerItems, setAnswerItems] = useState<any[]>([]);
   const [story, setStory] = useState<IStory>({
      title: '',
      sentences: [],
   });
   const [storyLength, setStoryLength] = useState<number>(0);
   const [flagD, setFlagD] = useState({ from: 0, to: 0 });
   const [flags, setFlags] = useState<any[]>([{ context: '', index: 0 }]);
   const [answer, setAnswer] = useState<string>('');

   // Panel 1
   const [p, setP] = useState<string>('-');
   const audioRef = useRef<HTMLAudioElement>(null);
   const [autoPlayAudio1, setAutoPlayAudio1] = useState<boolean>(true);

   // panel 2
   const [showEditModal, setShowEditModal] = useState(false);
   const [autoPlayAudio2, setAutoPlayAudio2] = useState<boolean>(true);

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
   }, []);

   const startClick = () => {
      clearClick();
      let ss: any[] = sentences.slice(sliderFrom - 1, sliderTo);
      setSentences(ss);
      setLeft(ss.length - counterState);
      setAhead(counterState);
      convertSentence(ss[counterState].context);
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
      convertSentence(ss[counterState].context);
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
      convertSentence(ss[counterState].context);
      if (audioRef.current) {
         audioRef.current.src = ss[counterState].audio;
      }
      setPanel(1);
   };

   // Check Finish
   useEffect(() => {
      if (counterState === 0 || panel === 0) return;
      // Check Finish
      if (counterState === sentences.length) {
         return setShowFinishModal(true);
      }
      convertSentence(sentences[counterState].context);
      setAnswerItems([]);
   }, [counterState]);

   // for answerItems
   useEffect(() => {
      for (let i in sentenceItems) {
         if (
            sentenceItems[i].active &&
            !containActiveItem(sentenceItems[i].index)
         ) {
            setAnswerItems([
               ...answerItems,
               ...[
                  {
                     index: sentenceItems[i].index,
                     context: sentenceItems[i].context,
                  },
               ],
            ]);
         }
         if (
            !sentenceItems[i].active &&
            containActiveItem(sentenceItems[i].index)
         ) {
            removeDeActiveItem(sentenceItems[i].index);
         }
      }
   }, [sentenceItems]);

   useEffect(() => {
      if (answerItems.length === 0) return;
      let t = '';
      for (let i in answerItems) {
         t = t.concat(`${answerItems[i].context} `);
      }
      setP(t);
   }, [answerItems]);

   useEffect(() => {
      if (panel === 1 && counterState !== sentences.length) {
         if (audioRef.current) {
            audioRef.current.src = sentences[counterState].audio;
            if (autoPlayAudio1) audioRef.current.play();
         }
      }
      if (panel === 2) {
         if (audioRef.current) {
            audioRef.current.src = sentences[counterState].audio;
            if (autoPlayAudio2) audioRef.current.play();
         }
      }
   }, [panel]);

   const calculateFlags = (sentences: ISentence[]) => {
      let tt: any[] = [];
      sentences.forEach((item, index) => {
         if (item.storyFlag === true) {
            tt.push({ context: item.context, index });
         }
      });
      return tt;
   };

   const convertSentence = (sentence: string) => {
      let t = shuffleArray(sentence.split(' '));
      let ans = [];
      for (let i in t) {
         ans.push({
            index: Number(i),
            key: Number(i),
            context: t[i],
            active: false,
         });
      }
      setSentenceItems(ans);
   };

   const containActiveItem = (index: number) => {
      for (let i in answerItems) {
         if (answerItems[i].index === index) return true;
      }
      return false;
   };

   const removeDeActiveItem = (index: number) => {
      let t = [];
      for (let i in answerItems) {
         if (answerItems[i].index !== index) t.push(answerItems[i]);
      }
      setAnswerItems(t);
   };

   const checkClick = () => {
      let result: boolean = true;
      let ans = sentences[counterState].context.split(' ');

      if (answerItems.length === 0 || answerItems.length !== ans.length) {
         result = false;
      } else {
         for (let i in ans) {
            if (ans[i] === answerItems[i].context) {
               continue;
            } else {
               result = false;
               break;
            }
         }
      }

      if (result) {
         toast.success('Correct', { autoClose: 1000 });
         setAhead(ahead + 1);
         setLeft(left - 1);
         setPanel(2);
      } else {
         toast.warn('Try Again');
      }
   };

   const clearClick = () => {
      setAnswerItems([]);
      setP('-');
      let t = [];
      for (let i in sentenceItems)
         t.push({
            index: sentenceItems[i].index,
            key: sentenceItems[i].index,
            context: sentenceItems[i].context,
            active: false,
         });
      setSentenceItems(t);
      setClear(!clear);
   };

   const showAnswerClick = () => {
      setAnswer(sentences[counterState].context);
      setTimeout(() => {
         setAnswer('');
      }, 6000);
   };

   const goNextClick = () => {
      setAhead(ahead + 1);
      setLeft(left - 1);
      setPanel(2);
   };

   const nextClick = () => {
      setStateCounter(counterState + 1);
      setPanel(1);
      setP('-');
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

   return (
      <div className="container">
         {panel === 0 && (
            <div className="pt-3 col-12 col-md-8 col-lg-6 mb-3">
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
                        to={`/stories/dict/${story._id}`}
                        className="btn my-1 bg-info"
                     >
                        <i className="bi bi-pencil" />
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
               <button className="btn btn-primary w-100" onClick={startClick}>
                  Start
               </button>
               <hr />
               <button className="btn btn-danger w-100" onClick={reviewToughs}>
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
            <div className="pt-3 col-12 col-md-8 col-lg-6">
               <div className="mb-2 w-100 d-flex justify-content-between">
                  <span className="badge bg-success" style={{ fontSize: 20 }}>
                     {ahead}
                  </span>
                  <Form.Check
                     type="switch"
                     id="custom-switch"
                     label="Auto Play"
                     checked={autoPlayAudio1}
                     onChange={e => {
                        setAutoPlayAudio1(e.target.checked);
                     }}
                  />
                  <span className="badge bg-danger" style={{ fontSize: 20 }}>
                     {left}
                  </span>
               </div>
               <div className="d-flex flex-wrap">
                  {sentenceItems.map(item => (
                     <SentenceItem
                        index={item.index}
                        context={item.context}
                        active={item.active}
                        clear={clear}
                        sentenceItems={sentenceItems}
                        setSentenceItems={setSentenceItems}
                     />
                  ))}
               </div>
               <p className="" style={{ fontSize: 28 }}>
                  {p}
               </p>
               <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={checkClick}
               >
                  Check
               </button>
               <button
                  className="btn btn-secondary w-100 mb-2"
                  onClick={clearClick}
               >
                  Clear
               </button>
               <button
                  className="btn btn-success w-100 mb-2"
                  onClick={showAnswerClick}
               >
                  Show answer
               </button>
               <p>{answer}</p>
               <audio
                  className="mb-2 w-100 rounded-2"
                  controls
                  ref={audioRef}
               ></audio>
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
                     checked={autoPlayAudio2}
                     onChange={e => {
                        setAutoPlayAudio2(e.target.checked);
                     }}
                  />
                  <span className="badge bg-danger" style={{ fontSize: 20 }}>
                     {left}
                  </span>
               </div>
               <div className="mb-1">
                  <label className="form-label">Context</label>
                  <div
                     className="alert text-dark"
                     style={{ backgroundColor: '#E9ECEF' }}
                  >
                     {sentences[counterState] &&
                        sentences[counterState].context}
                  </div>
               </div>
               {sentences[counterState]?.note && (
                  <div className="mb-1">
                     <label className="form-label">Note</label>
                     <div
                        className="alert text-dark"
                        style={{ backgroundColor: '#E9ECEF' }}
                     >
                        {sentences[counterState] &&
                           sentences[counterState].note}
                     </div>
                  </div>
               )}
               {sentences[counterState]?.meaning && (
                  <div className="mb-1">
                     <label className="form-label">Meaning (Persian)</label>
                     <div
                        className="alert text-dark"
                        style={{ backgroundColor: '#E9ECEF', direction: 'rtl' }}
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
                  className="btn btn-primary w-100 mb-2"
                  onClick={nextClick}
               >
                  Next
               </button>
               <Button
                  onClick={() => {
                     setShowEditModal(true);
                  }}
                  className="btn btn-secondary w-100 mb-2"
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

         <Modal
            show={showDeleteSentenceModal}
            onHide={() => {
               setShowDeleteSentenceModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Delete Sentence: ?</Modal.Title>
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

         <Modal
            show={showFinishModal}
            onHide={() => {
               setShowFinishModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Review done. Do you want do it again?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
               <Button
                  variant="secondary"
                  onClick={() => {
                     setShowFinishModal(false);
                     navigate('/stories');
                  }}
               >
                  No
               </Button>
               <Button
                  variant="primary"
                  onClick={() => {
                     setPanel(0);
                     setShowFinishModal(false);
                     setStateCounter(0);
                  }}
               >
                  Yes
               </Button>
            </Modal.Footer>
         </Modal>
      </div>
   );
};

export default StorySentenceReview;
