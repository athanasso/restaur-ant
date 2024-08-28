export interface Restaurant {
    id: string
    name: string
    averageRating: number
    reviews: Review[]
  }

  export interface Review {
    id: string
    rating: number
    visitDate: string
    comment: string
  }
