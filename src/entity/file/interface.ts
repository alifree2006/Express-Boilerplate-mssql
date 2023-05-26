import { Id, Model } from "@core/interface";

export type UsedPlace = {
  id: Id;
  entity: string;
};

export type File = Model & {
  title: string;
  url: string;
  mimeType: string;
  size: number;
  previewPath: string;
  usedPlaces: UsedPlace[];
};
