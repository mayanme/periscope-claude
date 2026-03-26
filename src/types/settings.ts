export interface FirmSettings {
  id: number;
  name: string;
  thesis: string;
  stageFocus: string[];
  sectorFocus: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InternalDocSummary {
  id: string;
  filename: string;
  createdAt: string;
  chunkCount: number;
}
