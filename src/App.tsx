
import { Toaster } from 'sonner';
import UserRoutes from './routes/UserRoutes';

const App = () => {
  return (
    <div>
      <Toaster
  position="top-right"
  toastOptions={{
    style: {
      backgroundColor: "#03000D",
      color: "#fff",
      border: "1px solid #190473",
    },
  }}
/>

      <UserRoutes/>
    </div>
  );
}

export default App;
