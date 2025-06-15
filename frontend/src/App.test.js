import { render } from '@testing-library/react';
import App from './App';

// Mock completo do react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="app">{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: () => <div>Route</div>,
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
}));

test('renders app without crashing', () => {
  const { container } = render(<App />);
  expect(container.firstChild).toHaveAttribute('data-testid', 'app');
}); 