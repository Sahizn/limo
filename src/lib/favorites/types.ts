export interface UserFavoritesData {
  categories: string[];
  favoritesOnly: boolean;
  updatedAt: string;
}

export const EMPTY_FAVORITES: UserFavoritesData = {
  categories: [],
  favoritesOnly: false,
  updatedAt: "",
};
