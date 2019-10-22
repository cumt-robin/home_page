const context = require.context("./svg", true, /\.svg$/);

context.keys().map(context);
