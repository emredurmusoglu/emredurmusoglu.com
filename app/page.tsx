import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      {/* Background — aurora blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-sky-500/35 via-indigo-500/25 to-fuchsia-500/25 blur-3xl" />
        <div className="absolute top-48 -left-24 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-emerald-400/20 via-cyan-400/15 to-sky-500/20 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-fuchsia-500/20 via-purple-500/20 to-indigo-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-6 py-12 md:py-24">
        {/* LOGO — avatar with glow */}
        <div className="mb-10 flex justify-center md:justify-start">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-sky-500/40 via-indigo-500/30 to-fuchsia-500/40 blur-xl" />
            <div className="relative h-[76px] w-[76px] md:h-[96px] md:w-[96px] overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
              <Image
                src="/ed-512.png"
                alt="ED logo"
                fill
                priority
                sizes="(max-width: 768px) 76px, 96px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* LEFT — ABOUT */}
          <section>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                Emre Durmuşoğlu
              </span>
            </h1>

            <div className="mb-6 h-px w-16 bg-gradient-to-r from-sky-400/60 via-indigo-400/40 to-fuchsia-400/60" />

            <p className="text-xl md:text-2xl text-white/80 mb-7 max-w-xl leading-relaxed">
              Merhaba, ben Emre. Kullanıcı deneyimi odaklı SaaS ve iOS ürünleri geliştiriyorum.
            </p>

            {/* Bunu büyüttük */}
            <p className="text-base md:text-lg text-white/65 max-w-xl leading-relaxed">
              Üzerinde çalıştığım projelerden ilki <span className="text-white/80 font-medium">Davetiva</span> — dijital
              davetiye oluşturma ve RSVP yönetimini tek linkte toplayan bir platform. Diğeri ise{" "}
              <span className="text-white/80 font-medium">AlarMix</span> — görevlerle alarmı gerçekten susturmayı
              amaçlayan, alışılmış alarm uygulamalarından farklı bir iOS deneyimi.
            </p>
          </section>

          {/* RIGHT — PROJECTS */}
          <section className="space-y-4">
            {/* Davetiva */}
            <a
              href="https://davetiva.com"
              target="_blank"
              rel="noreferrer"
              className="group block"
            >
              <div className="flex min-h-[168px] md:min-h-[190px] flex-col rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur transition hover:bg-white/8 hover:border-white/20 hover:shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-white">Davetiva</h3>
                    <Image
                      src="/logo.png"
                      alt="Davetiva logo"
                      width={22}
                      height={22}
                      className="rounded-sm opacity-90"
                    />
                  </div>
                  <span className="text-sm text-white/45 group-hover:text-white/70 transition">
                    → Uygulamaya Git
                  </span>
                </div>

                <p className="mt-4 text-white/70 leading-relaxed">
                  Dijital davetiye oluşturma ve RSVP yönetimi platformu. Davetiyeleri tek bağlantıdan paylaşmayı ve yanıtları takip etmeyi sağlar.
                </p>

                {/* underline en alta sabitlendi */}
                <div className="mt-auto pt-5">
                  <div className="h-px w-0 bg-gradient-to-r from-sky-400/70 via-indigo-400/50 to-fuchsia-400/70 transition-all duration-300 group-hover:w-24" />
                </div>
              </div>
            </a>

            {/* AlarMix */}
            <a
  href="https://apps.apple.com/tr/app/alarmix-alarm/id6757366872?l=tr"
  target="_blank"
  rel="noreferrer"
  className="group block"
>
              <div className="flex min-h-[168px] md:min-h-[190px] flex-col rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur transition hover:bg-white/8 hover:border-white/20 hover:shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-white">AlarMix</h3>
                    <Image
                      src="/AppIcon1024.png"
                      alt="AlarMix app icon"
                      width={22}
                      height={22}
                      className="rounded-md opacity-90"
                    />
                  </div>
                  <span className="text-sm text-white/45 group-hover:text-white/70 transition">
                    → Uygulamaya Git
                  </span>
                </div>

                <p className="mt-4 text-white/70 leading-relaxed">
                  Görev tabanlı alarm uygulaması. Görevler tamamlanmadan alarmı kapatmaya izin vermez ve daha aktif bir uyanma deneyimi sunar.
                </p>

                <div className="mt-auto pt-5">
                  <div className="h-px w-0 bg-gradient-to-r from-emerald-400/60 via-cyan-400/40 to-sky-400/60 transition-all duration-300 group-hover:w-24" />
                </div>
              </div>
            </a>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/10 pt-8 text-sm text-white/45">
          © {new Date().getFullYear()} Emre Durmuşoğlu
        </footer>
      </div>
    </main>
  );
}