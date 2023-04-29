import React from "react";
import ReactDOM from "react-dom/client";
import MathJaxContext from "better-react-mathjax/MathJaxContext";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<link
			rel="stylesheet"
			href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
			integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
			crossOrigin="anonymous"
		/>
		<MathJaxContext>
			<App />
		</MathJaxContext>
	</React.StrictMode>
);
