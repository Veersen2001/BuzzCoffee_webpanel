import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from "./App";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./redux/store/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  
  <Provider store={store}>
    <App />
    <Toaster position="top-right" reverseOrder={false} />
  </Provider>
  
);



