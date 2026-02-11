export interface Episode {
  id: string;
  number: number;
  season: number;
  title: string;
  duration: string;
  telegramCode: string;          // ✅ Watch/Stream এর জন্য
  downloadCode?: string;         // ✅ Download এর জন্য (optional)
  downloadLink?: string;         // ✅ Alternative download link (optional)
  
  // ✅ Detailed metadata (শুধু available episodes এর জন্য)
  fileSize?: string;
  audioLanguage?: string;
  subtitles?: string;
  quality?: string;
  
  // ✅ Premium Features
  thumbnail?: string;            // Episode specific thumbnail URL
  isComingSoon?: boolean;        // Coming Soon lock (কোনো details থাকবে না)
  releaseDate?: string;          // Release date for coming soon
  isUpcoming?: boolean;          // Backward compatibility
}

export interface Movie {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  telegramCode: string;          // ✅ Watch/Stream এর জন্য (Required)
  downloadCode?: string;         // ✅ Download এর জন্য (optional)
  downloadLink?: string;         // ✅ Alternative download link (optional)
  rating: number;
  views: string;
  year?: string;
  quality?: string;
  description?: string;
  episodes?: Episode[];
  isPremium?: boolean;
  createdAt?: any;
  
  // ✅ Enhanced metadata
  fileSize?: string;
  duration?: string;
  audioLanguage?: string;
  subtitles?: string;
  videoQuality?: string;
  
  // ✅ Premium Image Features (All Optional)
  detailBanner?: string;         // Separate banner for detail page (16:9 recommended)
  screenshots?: string[];        // Array of screenshot URLs (4-8 images)
  
  // ✅ Coming Soon Features
  isUpcoming?: boolean;
  releaseDate?: string;
  comingSoonSeasons?: number[];  // পুরা season lock করার জন্য [2, 3] means S2 & S3 coming soon
  
  // Premium Features
  isFeatured?: boolean;
  featuredOrder?: number;
  isTop10?: boolean;
  top10Position?: number;
  storyImage?: string;
  storyEnabled?: boolean;
  priority?: number;
  isExclusive?: boolean;
}

export interface StoryItem {
  id: string;
  image: string;              // Story circle এ যে image
  thumbnailUrl?: string;      // ভিতরে ক্লিক করলে যে বড় image
  movieId?: string;           // যদি কোনো movie এর সাথে linked থাকে
  link?: string;              // External link (optional)
  order: number;              // কত নাম্বারে দেখাবে
  createdAt?: any;
}

export interface BannerItem {
  id: string;
  movieId?: string;           // Movie এর সাথে connect
  title: string;
  image: string;              // Banner image
  description?: string;
  link?: string;              // External link (optional)
  order: number;              // Position
  isActive: boolean;
  createdAt?: any;
}

export interface AppSettings {
  botUsername: string;
  channelLink: string;          // Header Send বাটন + MovieDetails Telegram বাটন
  noticeChannelLink?: string;   // ✅ Notice REQ বাটনের জন্য আলাদা channel link
  noticeText?: string;          // Notice bar text
  noticeEnabled?: boolean;      // Notice দেখাবে কিনা
  autoViewIncrement?: boolean;
  categories?: string[];        // Custom categories যোগ করা যাবে
  
  // Premium Settings
  enableTop10?: boolean;
  enableStories?: boolean;
  enableBanners?: boolean;
  primaryColor?: string;        // Theme color
  appName?: string;             // App এর নাম
}

export type Category = 'Exclusive' | 'Korean Drama' | 'Series' | 'All' | 'Favorites' | string;
