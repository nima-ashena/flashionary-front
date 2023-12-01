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

   return (
      <>
         <div className="col-12 col-md-4 col-lg-3">
            <div className="card bg-dark text-light" id="story">
               <div className="card-body text-center">
                  <p className="card-title mb-3">{story.title}</p>
                  <div>
                     <Link
                        to={`/stories/show/${story._id}`}
                        className="btn my-1"
                        style={{ color: '#fff', backgroundColor: '#198754' }}
                        >
                        <i
                           className="bi bi-eye"
                           />
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
            </div>
         </div>
      </>
   );
};

export default Story;
