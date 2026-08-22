import { createClient, SupabaseClient } from "@supabase/supabase-js";

let clientInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (clientInstance) return clientInstance;
  try {
    const url = import.meta.env.VITE_SUPABASE_URL || "https://vyohpzwvrbtsbrwpzwnd.supabase.co";
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5b2hwend2cmJ0c2Jyd3B6d25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczODY0NzIsImV4cCI6MjEwMjk2MjQ3Mn0.XUhss832r2XPg8zHNkp8eVKWtvXmBYk6YOv46kjCfVQ";
    if (url && key && typeof url === "string" && url.startsWith("http")) {
      clientInstance = createClient(url, key);
    }
  } catch (e) {
    console.error("Gagal menginisialisasi Supabase client:", e);
  }
  return clientInstance;
};

// -------------------------------------------------------------
// PROJECTS SUPABASE HELPERS
// -------------------------------------------------------------
export const fetchProjectsFromSupabase = async (): Promise<any[] | null> => {
  try {
    const client = getSupabase();
    if (!client) return null;

    const { data, error } = await client
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return null;
    }

    if (!data || !Array.isArray(data)) return null;

    // Safely map database snake_case to frontend camelCase
    return data.map((item) => {
      let parsedTags: string[] = [];
      if (Array.isArray(item.tags)) {
        parsedTags = item.tags;
      } else if (typeof item.tags === "string" && item.tags.trim()) {
        try {
          parsedTags = JSON.parse(item.tags);
        } catch (e) {
          parsedTags = [];
        }
      }

      let parsedContent: string[] = [];
      if (Array.isArray(item.content)) {
        parsedContent = item.content;
      } else if (typeof item.content === "string" && item.content.trim()) {
        try {
          parsedContent = JSON.parse(item.content);
        } catch (e) {
          parsedContent = [];
        }
      }

      return {
        id: String(item.id || "proj-" + Math.random()),
        mainCategory: item.main_category || "ENGINEERING & DATA",
        subCategory: item.sub_category || "Web Development",
        headline: item.headline || "Untitled Project",
        deck: item.deck || "",
        author: item.author || "Andika Catur Ariantono",
        date: item.date || "2026",
        linkUrl: item.link_url || "",
        image: item.image || "",
        tags: Array.isArray(parsedTags) ? parsedTags : [],
        isFeatured: item.is_featured !== undefined ? Boolean(item.is_featured) : true,
        bgColor: item.bg_color || "bg-[#E3E3E3]",
        textColor: item.text_color || "text-black",
        subTextColor: item.sub_text_color || "text-black/80",
        badgeBg: item.badge_bg || "bg-black text-white",
        caption: item.caption || "",
        content: Array.isArray(parsedContent) ? parsedContent : []
      };
    });
  } catch (e) {
    console.error("Supabase fetch exception:", e);
    return null;
  }
};

export const upsertProjectToSupabase = async (project: any) => {
  try {
    const client = getSupabase();
    if (!client) return;

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

    const { error } = await client.from("projects").upsert(payload);
    if (error) {
      console.error("Supabase upsert error:", error);
    }
  } catch (e) {
    console.error("Supabase upsert exception:", e);
  }
};

export const deleteProjectFromSupabase = async (id: string) => {
  try {
    const client = getSupabase();
    if (!client) return;

    const { error } = await client.from("projects").delete().eq("id", id);
    if (error) {
      console.error("Supabase delete error:", error);
    }
  } catch (e) {
    console.error("Supabase delete exception:", e);
  }
};

export const subscribeToProjectsRealtime = (onUpdate: (projects: any[]) => void) => {
  const client = getSupabase();
  if (!client) return () => {};

  try {
    const channel = client
      .channel("public:projects:realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        async () => {
          const updated = await fetchProjectsFromSupabase();
          if (updated) {
            onUpdate(updated);
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (e) {
    console.error("Realtime subscription exception:", e);
    return () => {};
  }
};

// -------------------------------------------------------------
// CERTIFICATES SUPABASE HELPERS
// -------------------------------------------------------------
export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl: string;
  credentialUrl?: string;
  category?: string;
  description?: string;
}

export const fetchCertificatesFromSupabase = async (): Promise<CertificateItem[] | null> => {
  try {
    const client = getSupabase();
    if (!client) return null;

    const { data, error } = await client
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || !Array.isArray(data)) return null;

    return data.map((item) => ({
      id: String(item.id),
      title: item.title || "Untitled Certificate",
      issuer: item.issuer || "Self-Issued / Verified",
      date: item.date || "2026",
      imageUrl: item.image_url || item.imageUrl || "",
      credentialUrl: item.credential_url || item.credentialUrl || "",
      category: item.category || "General",
      description: item.description || ""
    }));
  } catch (e) {
    console.error("Supabase fetch certificates exception:", e);
    return null;
  }
};

export const upsertCertificateToSupabase = async (cert: CertificateItem) => {
  try {
    const client = getSupabase();
    if (!client) return;

    const payload = {
      id: String(cert.id),
      title: cert.title || "",
      issuer: cert.issuer || "",
      date: cert.date || "",
      image_url: cert.imageUrl || "",
      credential_url: cert.credentialUrl || "",
      category: cert.category || "General",
      description: cert.description || ""
    };

    await client.from("certificates").upsert(payload);
  } catch (e) {
    console.error("Supabase upsert certificate exception:", e);
  }
};

export const deleteCertificateFromSupabase = async (id: string) => {
  try {
    const client = getSupabase();
    if (!client) return;
    await client.from("certificates").delete().eq("id", id);
  } catch (e) {
    console.error("Supabase delete certificate exception:", e);
  }
};

export const subscribeToCertificatesRealtime = (onUpdate: (certs: CertificateItem[]) => void) => {
  const client = getSupabase();
  if (!client) return () => {};

  try {
    const channel = client
      .channel("public:certificates:realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "certificates" }, async () => {
        const updated = await fetchCertificatesFromSupabase();
        if (updated) onUpdate(updated);
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (e) {
    return () => {};
  }
};
