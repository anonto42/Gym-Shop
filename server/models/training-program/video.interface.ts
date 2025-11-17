import {Model} from "mongoose";

export interface IVideo {
    url: string;
}

export interface IVideoModel extends Model<IVideo> {
    f(): void;
}