export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  mobile?: string;
  bio?: string;
  gender?: string;
  image?: string;
  following: User[];
  followers: User[];
  stories: Story[];
  savePost: Post[];
}

export interface Post {
  id: number;
  caption: string;
  image: string;
  location?: string;
  createdAt: string;
  user: User;
  comments: Comment[];
  likedByUsers: User[];
}

export interface Story {
  id: number;
  user: User;
  image: string;
  caption?: string;
  timestamp: string;
}

export interface Comment {
  id: number;
  user: User;
  content: string;
  likedByUsers: User[];
  createdAt: string;
}

export interface SignupDto {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface MessageResponse {
  message: string;
}
