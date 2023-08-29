import {ConfigEnv, defineConfig} from 'vite'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import { visualizer } from "rollup-plugin-visualizer";
import { name } from './package.json'

export default ({mode, command}: ConfigEnv) => {
    const isDev = mode === 'development'
    const isAnalyze = mode === "analyze";
    return defineConfig({
        base: isDev ? '' : name,
        build: {

        },
        plugins: [
            isAnalyze && visualizer(),
        ]
    })
}