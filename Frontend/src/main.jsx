
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import {Provider} from 'react-redux';
import {store} from './redux/store.js';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

createRoot(document.getElementById("root")).render(
    <Provider store={store}> 
      <App />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </Provider>
);
