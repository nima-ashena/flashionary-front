const Test = () => {
   function handleAnswerChange(event) {
      console.log('TTTTTT');
   }

   return (
      <div onKeyDown={handleAnswerChange}>
         <p> Are You Smart?</p>

         <input type="text" />

         <small> Press Y for Yes or N for No</small>
      </div>
   );
};

export default Test;
