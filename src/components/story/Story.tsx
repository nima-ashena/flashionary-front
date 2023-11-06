import { FC, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteStoryApi } from '../../api/story.service';
import { IStory } from '../../interface/story.interface';

// const Story = ({ story }: { story: IStory }, renderValue: boolean) => {
const Story = (props: any) => {
   const story: IStory = props.story;
   const render: boolean = props.render;
   const setRender: React.Dispatch<React.SetStateAction<boolean>> =
      props.setRender;

   const [show, setShow] = useState(false);
   const handleClose = () => {
      setShow(false);
   };
   const handleShow = () => {
      setShow(true);
   };

   const deleteStoryClick = () => {
      handleClose();
      deleteStoryApi(story._id, (isOk, result) => {
         const t = toast.loading('Deleting Story...');
         if (isOk) {
            setRender(!render);
            toast.update(t, {
               render: 'story deleted successfully',
               type: 'success',
               isLoading: false,
               autoClose: 2000,
            });
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
      <>
         <div className="col-6 col-sm-4 col-md-4 col-lg-3">
            <div className="card bg-dark text-light" id="story">
               <div className="card-body text-center">
                  <p className="card-title mb-3">{story.title}</p>
                  <div>
                     <Link to={`/sentences/stories/show/${story._id}`} className="btn my-1">
                        <i className="bi bi-eye" style={{ color: '#198754' }} />
                     </Link>
                     <Link
                        to={`/sentences/stories/edit/${story._id}`}
                        className="btn my-1"
                        style={{ color: '#fff' }}
                     >
                        <i className="bi bi-pen" />
                     </Link>
                     <Link
                        to={``}
                        className="btn my-1"
                        style={{ color: 'red' }}
                        onClick={handleShow}
                     >
                        <i className="bi bi-trash" />
                     </Link>
                     {/* Modal */}
                     <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                           <Modal.Title>Delete Story: ?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{story.title}</Modal.Body>
                        <Modal.Footer>
                           <Button variant="secondary" onClick={handleClose}>
                              Close
                           </Button>
                           <Button variant="danger" onClick={deleteStoryClick}>
                              Yes
                           </Button>
                        </Modal.Footer>
                     </Modal>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Story;
