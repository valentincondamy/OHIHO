import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Brume · Jeu RPG isométrique développé par OHIHO",
  description:
    "Découvrez Brume, un prototype de jeu de récolte et d’aventure isométrique jouable directement dans le navigateur.",
};

const FEATURES = [
  ["Monde vivant", "Génération procédurale, rivières, cycle lumineux, faune passive et créatures hostiles."],
  ["Récolte & artisanat", "Bois, pierre, minerais, plantes et recettes pour fabriquer outils, arc, flèches et torches."],
  ["Combat en temps réel", "Visée à la souris, attaque directionnelle, arc à charge et projectiles avec collisions."],
  ["100 % navigateur", "Canvas 2D haute fréquence, interface responsive et déploiement web sans installation."],
] as const;

export default function BrumePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#071522] text-white">
      <section className="relative isolate min-h-[76vh] overflow-hidden border-b border-white/10">
        <Image
          src="/realisations/brume-cover.png"
          alt="Univers illustré du jeu Brume"
          fill
          priority
          className="-z-20 object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,15,18,.96)_0%,rgba(4,15,18,.74)_46%,rgba(4,15,18,.22)_100%)]" />
        <div className="site-shell flex min-h-[76vh] items-end py-16 md:items-center md:py-24">
          <div className="max-w-2xl">
            <p className="font-mono text-sm uppercase tracking-[0.22em] text-[#b8e59b]">
              Réalisation OHIHO · Prototype jouable
            </p>
            <h1 className="mt-5 text-6xl font-semibold leading-none tracking-[-0.06em] sm:text-7xl md:text-8xl">
              Brume
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/76 md:text-xl">
              Un jeu de récolte et d’aventure isométrique, doux à explorer et
              immédiatement jouable sur le web.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="https://brume.ohiho.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center rounded-full bg-[#d9b85f] px-7 font-semibold text-[#172116] transition hover:-translate-y-0.5 hover:bg-[#ebce79]"
              >
                Jouer à la démo
              </a>
              <Link
                href="/#portfolio"
                className="inline-flex min-h-12 items-center rounded-full border border-white/30 bg-black/20 px-7 font-semibold text-white backdrop-blur transition hover:border-white/60 hover:bg-white/10"
              >
                Toutes les réalisations
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="site-shell py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-[#69d8bf]">Le projet</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
              Du concept au prototype jouable.
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-white/68">
            <p>
              Brume part d’une idée simple : retrouver le plaisir calme de la récolte,
              de la progression et de l’exploration, dans un univers illustré inspiré
              des RPG isométriques.
            </p>
            <p>
              Le prototype réunit déjà le déplacement libre, les métiers, un inventaire
              complet, l’artisanat, le combat, la faune, la nage, la lumière et un monde
              généré progressivement autour du joueur.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {FEATURES.map(([title, description]) => (
            <article key={title} className="rounded-3xl border border-white/10 bg-white/[.045] p-7 backdrop-blur">
              <h3 className="text-xl font-semibold text-[#e7cf87]">{title}</h3>
              <p className="mt-3 leading-relaxed text-white/62">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0a1c25] py-20 md:py-28">
        <div className="site-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.18em] text-[#69d8bf]">Démo interactive</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">Essayez Brume ici.</h2>
            </div>
            <p className="max-w-md text-white/58">Cliquez sur Jouer dans la fenêtre, puis utilisez ZQSD, la souris et le clic gauche.</p>
          </div>
          <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/15 bg-black shadow-[0_30px_90px_rgba(0,0,0,.45)]">
            <div className="flex h-11 items-center gap-2 border-b border-white/10 bg-[#132b35] px-5" aria-hidden="true">
              <i className="h-2.5 w-2.5 rounded-full bg-[#eb766f]" />
              <i className="h-2.5 w-2.5 rounded-full bg-[#e8c46b]" />
              <i className="h-2.5 w-2.5 rounded-full bg-[#6fd49a]" />
              <span className="ml-3 font-mono text-xs text-white/40">brume.ohiho.fr</span>
            </div>
            <iframe
              src="https://brume.ohiho.fr/"
              title="Démonstration jouable de Brume"
              className="aspect-video w-full bg-[#18251b]"
              loading="eager"
              allow="fullscreen"
            />
          </div>
        </div>
      </section>

      <section className="site-shell py-20 text-center md:py-28">
        <p className="font-mono text-sm uppercase tracking-[0.18em] text-[#69d8bf]">Une idée à transformer ?</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
          OHIHO conçoit des expériences web qui sortent du cadre.
        </h2>
        <Link
          href="/#contact"
          className="mt-9 inline-flex min-h-12 items-center rounded-full bg-white px-8 font-semibold text-[#071522] transition hover:-translate-y-0.5 hover:bg-[#d9fff1]"
        >
          Parler de votre projet
        </Link>
      </section>
    </main>
  );
}
