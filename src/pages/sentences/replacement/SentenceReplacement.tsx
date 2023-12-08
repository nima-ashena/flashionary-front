import { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
   deleteSentenceApi,
   getSentencesApi,
   plusTrueSentenceApi,
} from '../../../api/sentence.service';
import { ISentence } from '../../../interface/sentence.interface';
import { shuffleArray } from '../../../utils/utils';
import SentenceItem from '../components/SentenceItem';
import { SentenceTypes } from '../../../utils/constants';
import EditSentenceModal from './EditSentenceModal';

const SentenceReplacement = () => {
   const navigate = useNavigate();

   const [sentences, setSentences] = useState<ISentence[]>([]);

   // start panel is zero (0)
   const [panel, setPanel] = useState(0);
   const [again, setAgain] = useState(false);
   const [counterState, setStateCounter] = useState<number>(0);
   const [left, setLeft] = useState<number>(0);
   const [ahead, setAhead] = useState<number>(0);
   const [clear, setClear] = useState(false);

   // Panel 0
   const [sliderCountValueMax, setSliderCountValueMax] = useState(15);
   const [sliderCountValueMin, setSliderCountValueMin] = useState(0);
   const [sliderLimitValue, setSliderLimitValue] = useState(10);
   const [limitMode, setLimitMode] = useState(false);
   const [type, setType] = useState<string>('');
   const [sentenceItems, setSentenceItems] = useState<any[]>([]);
   const [answerItems, setAnswerItems] = useState<any[]>([]);
   const [answer, setAnswer] = useState<string>('');
   const [autoPlayAudio1, setAutoPlayAudio1] = useState<boolean>(true);

   // Panel 1
   const [p, setP] = useState<string>('-');
   const audioRef = useRef<HTMLAudioElement>(null);

   // Panel 2
   const [showEditModal, setShowEditModal] = useState(false);
   const [autoPlayAudio2, setAutoPlayAudio2] = useState<boolean>(true);

   // finish modal
   const [showFinishModal, setShowFinishModal] = useState(false);
   const [showDeleteSentenceModal, setShowDeleteSentenceModal] =
      useState(false);

   const startClick = () => {
      setPanel(1);
      setAgain(!again);
   };

   useEffect(() => {
      clearClick();
      if (panel === 0) {
         return;
      }
      const id = toast.loading('Loading...');

      getSentencesApi(
         (isOk: boolean, result: any) => {
            if (isOk) {
               toast.dismiss(id);
               let ss: any[] = result.sentences;
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

               convertSentence(ss[counterState].context);
               if (audioRef.current) {
                  audioRef.current.src = ss[counterState].audio;
               }
            } else {
               toast.error(result.message);
            }
         },
         [
            { name: 'trueGuessLimitMax', value: sliderCountValueMax },
            { name: 'trueGuessLimitMin', value: sliderCountValueMin },
            { name: 'sort', value: 'replacementTrueGuessCount' },
            { name: 'type', value: type },
            { name: 'user', value: localStorage.getItem('userId') },
            { name: 'replacementMode', value: true },
            { name: 'story', value: 'free' },
         ],
      );
   }, [again]);

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
         plusTrueSentenceApi(
            {
               sentenceId: sentences[counterState]._id,
               plusType: 'replacement',
            },
            isOk => {
               if (!isOk) toast.error('Plus counter failed');
            },
         );
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
      plusTrueSentenceApi(
         { sentenceId: sentences[counterState]._id, plusType: 'replacement' },
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
               <select
                  className="form-select mb-3"
                  aria-label="Default select example"
                  onChange={e => {
                     if (e.target.value == 'all') return setType('');
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

               <button className="btn btn-primary w-100" onClick={startClick}>
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
               <button
                  className="btn btn-danger w-100 mb-2"
                  onClick={ignoreClick}
               >
                  Ignore
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
               {sentences[counterState].note && (
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

         {counterState < sentences.length && (
            <EditSentenceModal
               sentences={sentences}
               setSentences={setSentences}
               sentenceId={sentences[counterState]._id}
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
                     navigate('/sentences');
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
                     setAgain(!again);
                  }}
               >
                  Yes
               </Button>
            </Modal.Footer>
         </Modal>
      </div>
   );
};

export default SentenceReplacement;
