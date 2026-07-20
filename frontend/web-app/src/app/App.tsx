import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from './providers/QueryProvider';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <>
      <Toaster
        richColors
        position="top-right"
      />

      <QueryProvider>
        <AppRouter />
      </QueryProvider>
    </>
  );
}

export default App;
