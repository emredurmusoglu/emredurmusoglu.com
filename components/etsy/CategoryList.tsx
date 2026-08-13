import { SubmitButton } from "@/components/panel/SubmitButton";
import {
  createCategory,
  deleteCategory,
  renameCategory,
} from "@/lib/actions/etsy";
import type { CategoryOption } from "@/lib/etsy/dal";

/**
 * Kategori adı doğrudan satır içinde düzenleniyor: alanı değiştirip Enter'a
 * basmak yetiyor, ayrı bir "kaydet" adımı yok.
 */
export function CategoryList({
  kind,
  title,
  categories,
}: {
  kind: "income" | "expense";
  title: string;
  categories: CategoryOption[];
}) {
  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between px-3">
        <h2 className="text-sm font-medium text-neutral-700">
          {title}
          {categories.length ? (
            <span className="ml-2 text-neutral-400">{categories.length}</span>
          ) : null}
        </h2>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm">
        <form action={createCategory} className="flex items-center gap-2 p-1">
          <input type="hidden" name="kind" value={kind} />
          <input
            name="name"
            required
            maxLength={80}
            placeholder="Yeni kategori"
            aria-label="Yeni kategori adı"
            className="min-w-0 flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
          />
          <SubmitButton
            pendingLabel="Ekleniyor…"
            message="Eklendi"
            className="shrink-0 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
          >
            Ekle
          </SubmitButton>
        </form>

        {categories.length ? (
          <ul className="mt-1 border-t border-neutral-100 pt-1">
            {categories.map((category) => (
              <li
                key={category.id}
                className="group flex items-center gap-2 rounded-xl px-1 transition hover:bg-neutral-50"
              >
                <form action={renameCategory} className="min-w-0 flex-1">
                  <input type="hidden" name="id" value={category.id} />
                  <input
                    name="name"
                    defaultValue={category.name}
                    maxLength={80}
                    aria-label="Kategori adı"
                    className="w-full rounded-lg border border-transparent bg-transparent px-2 py-2 text-sm text-neutral-800 outline-none transition focus:border-neutral-300 focus:bg-white"
                  />
                </form>

                <form action={deleteCategory} className="shrink-0">
                  <input type="hidden" name="id" value={category.id} />
                  <button
                    type="submit"
                    aria-label={`${category.name} kategorisini sil`}
                    className="rounded-md p-1.5 text-neutral-300 transition hover:text-red-600 md:text-transparent md:group-hover:text-neutral-300"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-3 py-4 text-center text-sm text-neutral-400">
            Henüz kategori yok.
          </p>
        )}
      </div>
    </section>
  );
}
