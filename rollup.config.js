import ts from "@wessberg/rollup-plugin-ts";
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.tsx",
  output: {
    file: "lib/index.js",
    format: "cjs",
    exports: "default"
  },
  plugins: [ts(), resolve()],
  external: ["react", "react-dom"]
};
