import {model, models, Schema} from "mongoose";
import {IVideo, IVideoModel} from "@/server/models/training-program/video.interface";

const videoSchema = new Schema<IVideo>({ url: { type: String, default: '' } });

let Video: IVideoModel;

if (models.Video) {
    Video = models.Video as IVideoModel;
} else {
    Video = model<IVideo, IVideoModel>("Video", videoSchema);
}

export { Video };