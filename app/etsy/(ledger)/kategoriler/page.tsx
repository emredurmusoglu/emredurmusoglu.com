import { CategoryList } from "@/components/etsy/CategoryList";
import { requireEtsyOwner } from "@/lib/auth/session";
import { listCategories } from "@/lib/etsy/dal";

export default async function EtsyCategoriesPage() {
  // Kategoriler sadece defterin sahibinde: diğer kullanıcılar deftere döner.
  await requireEtsyOwner();
  const categories = await listCategories();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Kategoriler</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Gider ve gelir kalemlerini burada tanımlıyorsun. Silinen kategorinin
          kayıtları durur, sadece kategorisiz kalır.
        </p>
      </header>

      <CategoryList
        kind="expense"
        title="Gider kategorileri"
        categories={categories.filter((c) => c.kind === "expense")}
      />

      <CategoryList
        kind="income"
        title="Gelir kategorileri"
        categories={categories.filter((c) => c.kind === "income")}
      />
    </div>
  );
}
