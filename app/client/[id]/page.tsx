import ClientPerformanceDashboard from '../../../components/ClientPerformanceDashboard';
import RestaurantClientDashboard from '../../../components/RestaurantClientDashboard';

// Restaurant client IDs that should use the specialized restaurant dashboard
const restaurantClients = ['amano-trattoria', 'the-berczy-tavern'];

export default function ClientPage({ params }: { params: { id: string } }) {
  // Use restaurant dashboard for restaurant clients, generic dashboard for others
  if (restaurantClients.includes(params.id)) {
    return <RestaurantClientDashboard clientId={params.id} />;
  }
  
  return <ClientPerformanceDashboard />;
} 