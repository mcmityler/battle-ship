// src/index.js
import "./styles.css";
import { greeting } from "./greeting.js";

console.log(greeting);

// src/index.js
import testImage from "./ramenTest.jpg";

const image = document.createElement("img");
image.src = testImage;

document.body.appendChild(image);

let hi = "hi";
let hello = () => console.log("hey");
hello();
