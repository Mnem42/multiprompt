import * as esbuild from 'esbuild'
import * as fs from 'fs'
import { createServer } from "http";

// Change this to whatever the mod should be called, without the extension.
const MOD_NAME = "multiprompt"

// Change this to something else if you want to make it go somewhere that it
// normally wouldn't
const OUT_FILE = `sandboxels/mods/${MOD_NAME}.js`

await esbuild.build({
    entryPoints: ['src/main.ts'],

    outfile: OUT_FILE,
    platform: "browser",
    logLevel: "error",
    bundle: true,
    // dropLabels: ["dbg_assert"],

    loader: {
        // Force .html, .svg, and .css to load as text
        ".html": "text",
        ".css": "text",
        ".svg": "text"
    },

    banner: {
        js: `// ${MOD_NAME}.js`
    },
}).then(async () =>{
    let stats = fs.statSync(`sandboxels/mods/${MOD_NAME}.js`)
    console.log("Build finished")
    console.log("Build output size: ", stats.size, "(B)")

    fs.copyFile(`sandboxels/mods/${MOD_NAME}.js`, `sandboxels-mods/mods/${MOD_NAME}.js`, () => console.log("File copied"))

    console.log("Faking live server...")

    const data = fs.readFileSync(`sandboxels/mods/${MOD_NAME}.js`)

    const hostname = 'localhost';
    const port = 3000;

    const server = createServer((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/javascript');
        res.end(data);
    });

    server.listen(port, hostname, () => {
        console.log(`Mod hosted at: http://${hostname}:${port}/`);
    });
})