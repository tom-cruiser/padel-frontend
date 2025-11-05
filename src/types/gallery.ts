export interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  fileId: string;
  isActive: boolean;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export interface GalleryImageResponse {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  fileId?: string;
  isActive: boolean;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}