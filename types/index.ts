export interface Profile {
  full_name: string;
  avatar_url?: string;
  role: 'student' | 'admin';
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  program: string;
}

export interface Problem {
  id: string;
  module_id: string;
  question_markdown: string;
  hint_markdown: string | null;
  solution_markdown: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  module?: { title: string } | null; 
}

export interface WikiEdit {
  id: string;
  page_id: string;
  user_id: string;
  proposed_content: string;
  comment: string | null;
  status: string;
  created_at: string;
  page: { title: string; content: string };
  user: { full_name: string; email: string } | null;
}
