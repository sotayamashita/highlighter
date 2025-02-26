export interface Highlight {
  id: string;
  text: string;
  createdAt: Date;
  startOffset: number;
  endOffset: number;
  comment?: string;
  color: string;
}
