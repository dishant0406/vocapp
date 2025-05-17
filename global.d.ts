type Episode = {
  id: string;
  name: string;
  duration: number;
  description: string;
  imageUrl?: string;
};

type Podcast = {
  id: string;
  name: string;
  imageUrl: string;
  duration: number;
  description: string;
  episodes: Episode[];
};

declare module "@hugeicons/core-free-icons";
