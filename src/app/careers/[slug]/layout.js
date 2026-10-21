function publicCareersBase() {
  return (
    String(process.env.NEXT_PUBLIC_API_URL || "")
      .replace(/\/user\/?$/, "")
      .replace(/\/$/, "") + "/public/careers"
  );
}

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  if (!slug) {
    return { title: "Job" };
  }

  try {
    const res = await fetch(`${publicCareersBase()}/jobs/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      const title = json?.data?.job?.title;
      if (title) {
        const full = `${title} | zyro`;
        return {
          title: { absolute: full },
          description: `Apply for ${title} — open role at zyro.`,
          openGraph: {
            title: full,
            description: `Apply for ${title} — open role at zyro.`,
          },
          twitter: {
            title: full,
            description: `Apply for ${title} — open role at zyro.`,
          },
        };
      }
    }
  } catch {
    /* fall through */
  }

  return {
    title: { absolute: "Job | zyro" },
    description: "Explore this open role and apply online.",
    openGraph: { title: "Job | zyro" },
    twitter: { title: "Job | zyro" },
  };
}

export default function CareerJobLayout({ children }) {
  return children;
}
