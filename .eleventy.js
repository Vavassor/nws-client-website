const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function (eleventyConfig) {
  let options = {
    html: true,
    breaks: true,
    linkify: true,
  };

  let anchorOptions = {
    permalink: markdownItAnchor.permalink.linkAfterHeader({
      assistiveText: (title) => `Permalink to “${title}”`,
      style: "visually-hidden",
      visuallyHiddenClass: "visually-hidden",
      wrapper: ['<div class="heading-and-link">', "</div>"],
    }),
  };

  eleventyConfig.setLibrary(
    "md",
    markdownIt(options).use(markdownItAnchor, anchorOptions)
  );

  eleventyConfig.addPassthroughCopy("css");

  return {
    pathPrefix: "/",
  };
};
