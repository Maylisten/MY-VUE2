import babel from "rollup-plugin-babel";
import serve from "rollup-plugin-serve";

export default {
    input: "./src/index.js",
    output: {
        file: "./dist/vue.js",
        format: "umd", // 在window 上 Vue
        name: "Vue",
        sourcemap: true,
    },
    plugins: [
        babel({
            exclude: "node_modules/**",

        }),
        serve({
            port: 3000,
            contentBase: "",
            openPage: "./diff.html",
            open: true,
        })
    ]
}