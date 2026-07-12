export interface Category {
  id: string;
  label: string;
}

export interface MenuItem {
  id: number;
  categoryId: string;
  title: string;
  description: string;
  price: number;
  image: string;
  isHidden?: boolean;
}
