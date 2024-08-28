import { getRestaurantDetails } from '@/lib/api'
import RestaurantDetails from '@/components/RestaurantDetails'

export default async function RestaurantPage({ params }: { params: { id: string } }) {
  const restaurant = await getRestaurantDetails(params.id)

  if (!restaurant) {
    return <div>Restaurant not found</div>
  }

  return <RestaurantDetails restaurant={restaurant} />
}