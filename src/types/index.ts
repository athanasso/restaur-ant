export interface Restaurant {
    reviews: Review[]
    id: number
    name: string
    phoneNumber: string
    address: string
    averageRating: number
  }

  export interface Review {
    id: number
    rating: number
    createdAt: Date
    comment: string
    user: any
  }