export interface IAddSentence {
   context: string;
   meaning?: string;
   user?: string;
   note?: string;
   translateApi?: boolean;
   noteApi?: boolean;
   TTSEngine?: string;
   type?: string;
   storyFlag?: boolean,
   storyTough?: boolean,
   reviewImportance?: boolean;
   replacementImportance?: boolean;
}

export interface ISentence {
   _id?: string;
   context: string;
   meaning?: string;
   audio?: string;
   note?: string;
   noteAudio?: string;
   is_disable?: Boolean;
   true_guess_count?: number;
   reviewTrueGuessCount?: number;
   replacementTrueGuessCount?: number;
   dictTrueGuessCount?: number;
   reviewImportance?: boolean;
   replacementImportance?: boolean;
   dictImportance?: boolean;
   story?: string;
   vocab?: string;
   completed?: Boolean;
   type?: string;
   user?: any;
   storyFlag?: boolean,
   storyTough?: boolean,
}
