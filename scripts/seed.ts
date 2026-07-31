/**
 * Ana sayfada zaten var olan iki projeyi DB'ye taşır.
 *
 *   npm run db:seed
 *
 * Tekrar tekrar çalıştırılabilir — aynı slug varsa üzerine yazmaz.
 */
import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const { db } = await import("../lib/db");
  const { projects } = await import("../lib/db/schema");

  const seedData = [
    {
      slug: "davetiva",
      title: "Davetiva",
      description:
        "Dijital davetiye oluşturma ve RSVP yönetimi platformu. Davetiyeleri tek bağlantıdan paylaşmayı ve yanıtları takip etmeyi sağlar.",
      status: "active" as const,
      url: "https://davetiva.com",
      iconUrl: "/logo.png",
      accent: "from-sky-400/70 via-indigo-400/50 to-fuchsia-400/70",
      isPublic: true,
      sort: 0,
    },
    {
      slug: "alarmix",
      title: "AlarMix",
      description:
        "Görev tabanlı alarm uygulaması. Görevler tamamlanmadan alarmı kapatmaya izin vermez ve daha aktif bir uyanma deneyimi sunar.",
      status: "shipped" as const,
      url: "https://apps.apple.com/tr/app/alarmix-alarm/id6757366872?l=tr",
      iconUrl: "/AppIcon1024.png",
      accent: "from-emerald-400/60 via-cyan-400/40 to-sky-400/60",
      isPublic: true,
      sort: 1,
    },
  ];

  const result = await db
    .insert(projects)
    .values(seedData)
    .onConflictDoNothing({ target: projects.slug })
    .returning({ slug: projects.slug });

  if (result.length) {
    console.log(`Eklendi: ${result.map((r) => r.slug).join(", ")}`);
  } else {
    console.log("Projeler zaten mevcut, değişiklik yapılmadı.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
