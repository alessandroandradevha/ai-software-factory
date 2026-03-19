import type { NextPage } from 'next';
import Dashboard from '../components/Dashboard';

interface HomeProps {
}
const Home: NextPage<HomeProps> = () => {
  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default Home;