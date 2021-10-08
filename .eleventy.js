const yaml = require("js-yaml");
const CleanCSS = require("clean-css");
const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
    eleventyConfig.addFilter("cssmin", function (code) {
        return new CleanCSS({}).minify(code).styles;
    });
    // To Support .yaml Extension in _data
    // You may remove this if you can use JSON
    eleventyConfig.addDataExtension("yaml", (contents) =>
        yaml.safeLoad(contents)
    );
    eleventyConfig.addNunjucksFilter("limit", (arr, limit) => arr.slice(0, limit));
    // Set directories to pass through to the public folder
    eleventyConfig.addPassthroughCopy("./source/admin");
    eleventyConfig.addPassthroughCopy("./source/assets/images");
    eleventyConfig.addPassthroughCopy("./source/assets/scripts");
    eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
        // Eleventy 1.0+: use this.inputPath and this.outputPath instead
        if (outputPath && outputPath.endsWith(".html")) {
            let minified = htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true
            });
            return minified;
        }
        return content;
    });
    eleventyConfig.addWatchTarget("./source/assets/styles/");
    return {
        markdownTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dir: {
            input: "source",
            output: "public",
            includes: "_includes",
        }
    };
};
