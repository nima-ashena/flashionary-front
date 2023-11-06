import { useNavigate } from 'react-router-dom';

const Back = () => {
   const navigate = useNavigate();

   const route = () => {
      navigate('/sentences/stories');
   };

   return (
      <i
         onClick={route}
         className="bi bi-arrow-left-square-fill"
         style={{ fontSize: 30, margin: 0, cursor: 'pointer' }}
      ></i>
   );
};

export default Back;
