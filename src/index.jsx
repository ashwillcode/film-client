import { createRoot } from 'react-dom/client';
import "./index.scss";

const FilmApplication = () => {
  return (
    <div className="film">
      <div>Good morning</div>
    </div>
  );
};

const container = document.querySelector("#root");
const root = createRoot(container);
root.render(<FilmApplication />);
