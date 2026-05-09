export interface Profile {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  title: string;
  issuer: string | null;
  year: string | null;
  image_url: string | null;
  category: string | null;
  created_at: string;
}
