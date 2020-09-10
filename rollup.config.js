import ts from "@wessberg/rollup-plugin-ts";
import resolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";

export default [
  {
    input: "src/index.tsx",
    output: {
      file: "lib/index.js",
      format: "cjs",
      exports: "default"
    },
    plugins: [ts(), resolve()],
    external: ["react", "react-dom"]
  },
  {
    input: "src/slider.scss",
    output: {
      file: "lib/slider.min.css"
    },
    plugins: [
      postcss({
        extract: true,
        minimize: true,
        plugins: [autoprefixer()]
      })
    ]
  }
];
