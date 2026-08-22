import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://vyohpzwvrbtsbrwpzwnd.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5b2hwend2cmJ0c2Jyd3B6d25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczODY0NzIsImV4cCI6MjEwMjk2MjQ3Mn0.XUhss832r2XPg8zHNkp8eVKWtvXmBYk6YOv46kjCfVQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseProject {
  id: string;
  main_category: string;
  sub_category: string;
  headline: string;
  deck?: string;
  author?: string;
  date?: string;
  link_url?: string;
  image?: string;
  tags?: string[];
  is_featured?: boolean;
  bg_color?: string;
  text_color?: string;
  sub_text_color?: string;
  badge_bg?: string;
  caption?: string;
  content?: string[];
}

export const fetchProjectsFromSupabase = async (): Promise<any[] | null> => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return null;
    }

    if (!data) return null;

    // Map database snake_case to frontend camelCase
    return data.map((item) => ({
      id: item.id,
      mainCategory: item.main_category,
      subCategory: item.sub_category,
      headline: item.headline,
      deck: item.deck,
      author: item.author,
      date: item.date,
      linkUrl: item.link_url,
      image: item.image,
      tags: Array.isArray(item.tags) ? item.tags : typeof item.tags === "string" ? JSON.parse(item.tags) : [],
      isFeatured: item.is_featured,
      bgColor: item.bg_color || "bg-[#E3E3E3]",
      textColor: item.text_color || "text-black",
      subTextColor: item.sub_text_color || "text-black/80",
      badgeBg: item.badge_bg || "bg-black text-white",
      caption: item.caption,
      content: Array.isArray(item.content) ? item.content : typeof item.content === "string" ? JSON.parse(item.content) : []
    }));
  } catch (e) {
    console.error("Supabase fetch exception:", e);
    return null;
  }
};

export const upsertProjectToSupabase = async (project: any) => {
  try {
    const payload = {
      id: String(project.id),
      main_category: project.mainCategory || "BERANDA",
      sub_category: project.subCategory || "General",
      headline: project.headline || "Untitled Project",
      deck: project.deck || "",
      author: project.author || "Andika Catur Ariantono",
      date: project.date || "2026",
      link_url: project.linkUrl || "",
      image: project.image || project.imageUrl || "",
      tags: Array.isArray(project.tags) ? project.tags : [],
      is_featured: Boolean(project.isFeatured),
      bg_color: project.bgColor || "bg-[#E3E3E3]",
      text_color: project.textColor || "text-black",
      sub_text_color: project.subTextColor || "text-black/80",
      badge_bg: project.badgeBg || "bg-black text-white",
      caption: project.caption || "",
      content: Array.isArray(project.content) ? project.content : []
    };

    const { error } = await supabase.from("projects").upsert(payload);
    if (error) {
      console.error("Supabase upsert error:", error);
    }
  } catch (e) {
    console.error("Supabase upsert exception:", e);
  }
};

export const deleteProjectFromSupabase = async (id: string) => {
  try {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      console.error("Supabase delete error:", error);
    }
  } catch (e) {
    console.error("Supabase delete exception:", e);
  }
};
