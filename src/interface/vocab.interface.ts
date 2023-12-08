export interface IAddVocab {
   user: string;
   title: string;
   note: string;
   meaning: string;
   type: string;
   compoundType?: string;
   example: string;
   definition: string;
   phonetics: string;
   dictionaryApi: boolean;
   translateApi: boolean;
   TTSEngine: string;
   reviewImportance?: boolean;
   dictImportance?: boolean;
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
   is_disable?: boolean;
   true_guess_count?: number;
   reviewTrueGuessCount?: number;
   dictTrueGuessCount?: number;
   reviewImportance?: boolean;
   dictImportance?: boolean;
   completed?: boolean;
   note?: string;
   user?: any;
}
