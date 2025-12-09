
import { Toaster } from 'sonner';
import UserRoutes from './routes/UserRoutes';

const App = () => {
  return (
    <div>
      <Toaster richColors position="top-right" />
      <UserRoutes/>
    </div>
  );
}

export default App;
