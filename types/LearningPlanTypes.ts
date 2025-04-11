export type ResourceItem = {
    title: string;
    url: string;
    duration?: string;
  };
  
  export type ResourceData = {
    type: 'video' | 'article';
    title: string;
    url: string;
    weekIndex: number;
  };
  
  export type WeekData = {
    week: string;
    youtubeVideos: ResourceItem[];
    learningArticles: ResourceItem[];
  };
  
  export type LearningPlanData = {
    weeks: WeekData[];
  };