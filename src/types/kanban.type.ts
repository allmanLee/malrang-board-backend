export type BoardStatus = 'todo' | 'doing' | 'pending' | 'done';

// 태그 배열 타입
export interface Tag {
  id: number;
  title: string;
  color: string;
}

// 커밋 배열 타입
export interface Commit {
  id: number;
  title: string;
  created_date: string;
  userIdx: number;
  card_idx: number;
}
