export interface IAddStory {
   title: string;
}

export interface IStory {
   _id?: string;
   title: string;
   sentences?: any[];
   cat?: string;
   note?: string;
   noteAudio?: string;
   category?: string;
   counterState?: number;
   translateApi?: boolean;
   flags?: any[];
   toughs?: any[];
}
