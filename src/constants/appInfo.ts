export const Categories = {
  Relax: 1,
  Esthetic: 2,
  Hair: 3,
  Nail: 4,
  Eyelashes: 5,
  Other: 6,
} as const

export const CATEGORIES: Record<number, string> = {
  [Categories.Relax]: toJapanese(Categories.Relax) as string,
  [Categories.Esthetic]: toJapanese(Categories.Esthetic) as string,
  [Categories.Hair]: toJapanese(Categories.Hair) as string,
  [Categories.Nail]: toJapanese(Categories.Nail) as string,
  [Categories.Eyelashes]: toJapanese(Categories.Eyelashes) as string,
  [Categories.Other]: toJapanese(Categories.Other) as string,
}

type Categories = (typeof Categories)[keyof typeof Categories]

export function toJapanese(category: number) {
  switch (category) {
    case Categories.Relax:
      return 'リラク'
    case Categories.Esthetic:
      return 'エステ'
    case Categories.Hair:
      return 'ヘア'
    case Categories.Nail:
      return 'ネイル'
    case Categories.Eyelashes:
      return 'まつげ'
    case Categories.Other:
      return 'その他'
  }
}

export const INVITE_POINT: number = 30000
