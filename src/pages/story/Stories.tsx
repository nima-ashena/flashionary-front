import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { addStoryApi, getStoriesApi } from '../../api/story.service';
import Story from './Story';
import { IStory } from '../../interface/story.interface';
import { storyTypes } from '../../utils/constants';

const Stories = () => {
   const [story, setStory] = useState<IStory>({ title: '' });

   const [showAdd, setShowAdd] = useState(false);

   const [stories, setStories] = useState<IStory[]>([]);
   const [render, setRender] = useState<boolean>(false);

   useEffect(() => {
      getStoriesApi((isOk, result) => {
         if (isOk) {
            setStories(result.stories);
         } else {
            console.log(result.message);
         }
      });
   }, [render]);

   const addStoryClick = () => {
      if (story.title === '') return toast.warn('Please fill title');

      const id = toast.loading('Adding Story...');
      addStoryApi(story, (isOk, result) => {
         if (isOk) {
            toast.update(id, {
               render: 'story added successfully',
               type: 'success',
               isLoading: false,
               autoClose: 2000,
            });
            setStory({ title: '', note: '' });
            setShowAdd(false);
            setRender(!render);
         } else {
            console.log(result.message);
            toast.update(id, {
               render: result.response.data.message,
               type: 'error',
               isLoading: false,
               autoClose: 2000,
            });
         }
      });
   };

   return (
      <div className="container">
         <div className="p-3 row">
            <button
               className="btn btn-secondary col-md-8 col-lg-6"
               onClick={() => {
                  setShowAdd(true);
               }}
            >
               Add Story
               <i className="bi bi-arrow-down"></i>
            </button>
            <Modal
               show={showAdd}
               onHide={() => {
                  setShowAdd(false);
               }}
            >
               <Modal.Header closeButton>
                  <Modal.Title>Add Story</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <form>
                     <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                           type="text"
                           className="form-control"
                           aria-describedby="emailHelp"
                           value={story.title}
                           onChange={e => {
                              setStory({ ...story, title: e.target.value });
                           }}
                        />
                     </div>
                     <div className="mb-3">
                        <label className="form-label">Note</label>
                        <textarea
                           rows={3}
                           className="form-control"
                           value={story.note}
                           onChange={e => {
                              setStory({ ...story, note: e.target.value });
                           }}
                        />
                     </div>
                     <div className="mb-3">
                        <label className="form-label">Compound Type</label>
                        <select
                           className="form-select"
                           aria-label="Default select example"
                           onChange={e => {
                              setStory({
                                 ...story,
                                 category: e.target.value,
                              });
                           }}
                        >
                           {storyTypes.map(item => (
                              <option value={item}>{item}</option>
                           ))}
                        </select>
                     </div>
                  </form>
                  <Button
                     className="w-100"
                     variant="primary"
                     onClick={addStoryClick}
                  >
                     Add story
                  </Button>
               </Modal.Body>
            </Modal>
         </div>

         <div className="row align-items-center px-1 g-1">
            {stories.length === 0 && (
               <div className="alert alert-warning" role="alert">
                  There isn't any stories
               </div>
            )}
            {stories.map(item => (
               <Story
                  story={item}
                  render={render}
                  setRender={setRender}
                  key={item._id}
               />
            ))}
         </div>
      </div>
   );
};

export default Stories;
