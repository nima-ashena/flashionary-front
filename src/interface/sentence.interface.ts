export interface IAddSentence {
   user: string;
   context: string;
   meaning?: string;
   note?: string;
   translateApi?: boolean;
   TTSEngine?: string;
   type?: string;
}

export interface ISentence {
   _id: string;
   context: string;
   meaning?: string;
   audio: string;
   note: string;
   is_disable?: Boolean;
   true_guess_count?: Number;
   story?: string;
   vocab?: string;
   completed?: Boolean;
   type: string;
   user?: string;
}
