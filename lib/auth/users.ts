/**
 * Etsy defterine girebilen kullanıcılar.
 *
 * Parolalar burada DEĞİL, env'de duruyor — repoya hash bile girmesin diye.
 * Yeni hash üretmek için: `npm run panel:hash -- 'parola'`
 *
 * `owner` rolü aynı zamanda /panel'e de erişebilir; `member` sadece /etsy.
 */
export type Role = "owner" | "member";

export type AppUser = {
  username: string;
  /** Arayüzde görünen ad */
  label: string;
  role: Role;
  /** Parola hash'ini tutan env değişkeninin adı */
  hashEnv: string;
};

export const USERS: AppUser[] = [
  {
    username: "emre",
    label: "Emre",
    role: "owner",
    // Panelle aynı parola — tek yerden yönetiliyor.
    hashEnv: "PANEL_PASSWORD_HASH",
  },
  {
    username: "dryaaky",
    label: "Derya",
    role: "member",
    hashEnv: "ETSY_DRYAAKY_PASSWORD_HASH",
  },
  {
    username: "ismailcan",
    label: "İsmail Can",
    role: "member",
    hashEnv: "ETSY_ISMAILCAN_PASSWORD_HASH",
  },
];

export function findUser(username: string): AppUser | null {
  const key = username.trim().toLowerCase();
  return USERS.find((user) => user.username === key) ?? null;
}

export function userLabel(username: string): string {
  return findUser(username)?.label ?? username;
}
