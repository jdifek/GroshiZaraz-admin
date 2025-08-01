/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface Category {
  id: number;
  name: string;
  icon?: string;
  nameUk: string;
}
export interface CategoryCreateDto {
  name: string;
  icon?: string;
  nameUk: string;
}

export interface CategoryUpdateDto extends CategoryCreateDto {}