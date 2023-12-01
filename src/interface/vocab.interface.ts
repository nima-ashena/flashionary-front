export interface IAddVocab {
   user: string;
   title: string;
   meaning: string;
   type: string;
   compoundType?: string;
   example: string;
   definition: string;
   phonetics: string;
   dictionaryApi: boolean;
   audioApi: boolean;
   translateApi: boolean;
   TTSEngine: string;
}

export interface IVocab {
   _id?: string;
   title: string;
   meaning?: string;
   phonetics?: string;
   audio?: string | any;
   audioFile?: File;
   type?: string;
   compoundType?: string;
   definition?: string;
   example?: string;
   sentences?: any[];
   is_disable?: Boolean;
   true_guess_count?: number;
   completed?: Boolean;
   note?: string;
   user?: string;
}
