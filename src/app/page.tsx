import RestaurantList from "@/components/RestaurantList"

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome to RestaurAnt</h1>
      <RestaurantList />
    </div>
  )
}