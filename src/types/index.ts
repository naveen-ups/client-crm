export interface SiteSectionContent {
  id: string; // 'hero' | 'philosophy' | 'founder' | 'heritage' | 'footer'
  section_name: string;
  title: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  data?: Record<string, any>;
  updated_at?: string;
}

export interface CollectionItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  badge?: string;
  link?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CustomCategoryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  badge?: string;
  link?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GemstoneItem {
  id: string;
  name: string;
  planet?: string;
  description: string;
  image_url: string;
  badge?: string;
  link?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TestimonialItem {
  id: string;
  client_name: string;
  location?: string;
  rating: number;
  piece_created?: string;
  date_tag?: string;
  quote: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PlanItem {
  id: string;
  plan_type: string;
  label: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CompleteWebsiteContent {
  sections: Record<string, SiteSectionContent>;
  collections: CollectionItem[];
  customCategories: CustomCategoryItem[];
  gemstones: GemstoneItem[];
  testimonials: TestimonialItem[];
  plans: PlanItem[];
  updatedAt: string;
}

export interface WebsiteRecord {
  id: string;
  name: string;
  domain?: string;
  content: CompleteWebsiteContent;
  created_at?: string;
  updated_at?: string;
}

