import { useEffect, useState } from 'react';

const SentenceItem = (props: any) => {
   const index = props.index;
   const context = props.context;
   const sentenceItems = props.sentenceItems;
   const setSentenceItems = props.setSentenceItems;
   const clear = props.clear;

   const [active, setActive] = useState(props.active);

   useEffect(() => {
      let t = [];
      for (let i in sentenceItems) {
         if (sentenceItems[i].index === index) {
            t.push({
               index: sentenceItems[i].index,
               context: sentenceItems[i].context,
               active: active,
            });
         } else {
            t.push({
               index: sentenceItems[i].index,
               context: sentenceItems[i].context,
               active: sentenceItems[i].active,
            });
         }
      }
      setSentenceItems(t);
   }, [active]);

   useEffect(() => {
      setActive(false);
   }, [clear]);

   return (
      <>
         <div
            style={{
               border: '2px solid',
               borderColor: active ? '#13eb50' : 'gray',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               width: 'min-content',
               margin: '4px',
               padding: '7px',
               borderRadius: '6px',
               cursor: 'pointer',
            }}
            onClick={e => {
               setActive(!active);
            }}
         >
            {context}
         </div>
      </>
   );
};

export default SentenceItem;
