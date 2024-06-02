import Landing from '../components/Landing';
import { useAuth } from '../hooks/useAuth';

const AppLayout = () => {
  const { user } = useAuth();
  return <>{user ? <div></div> : <Landing />}</>;
};

export default AppLayout;
