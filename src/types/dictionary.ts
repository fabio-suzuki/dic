export interface DictionaryEntry {
  id: string;
  term: string;
  definition: string;
  semantics: string;
  example: string;
  illustration?: string;
  tags: string[];
}
