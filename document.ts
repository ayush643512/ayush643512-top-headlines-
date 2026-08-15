export type DocumentCategory =
  | "world"
  | "technology"
  | "business"
  | "science"
  | "culture"
  | "politics"
  | "other";

export interface HeadlineDocument {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: DocumentCategory;
  keywords: string[];
  file_url: string;
  file_path: string;
  thumbnail_url: string | null;
  file_size: number;
  downloads: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentListItem
  extends Pick<
    HeadlineDocument,
    | "id"
    | "title"
    | "slug"
    | "description"
    | "category"
    | "thumbnail_url"
    | "file_size"
    | "downloads"
    | "published"
    | "created_at"
  > {}

export type DocumentSort = "latest" | "downloads";
