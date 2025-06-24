// @ts-nocheck
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default config;
