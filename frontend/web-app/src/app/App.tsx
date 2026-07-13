import { QueryProvider } from './providers/QueryProvider';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
}

export default App;