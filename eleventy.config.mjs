import path from "node:path";
import { fileURLToPath } from "node:url";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import markdownIt from "markdown-it";
import markdownItObsidian from "markdown-it-obsidian";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy('src/assets');
    eleventyConfig.addPassthroughCopy('src/labs/images');
    eleventyConfig.addPassthroughCopy('src/projects/images');
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(syntaxHighlight);

     const mdLib = markdownIt({
      html: true,
      breaks: true,
      linkify: true
      }).use(markdownItObsidian, {
        baseURL: "/labs/",
        relativeBaseURL: "./",
        makeAllLinksAbsolute: false
      });

      eleventyConfig.setLibrary("md", mdLib);

    eleventyConfig.addFilter("dateString", (dateObj) => {
      return dateObj.toISOString().split('T')[0];
    });
    eleventyConfig.addCollection("labs", function(collectionApi) {
      return collectionApi.getFilteredByGlob("src/labs/*.md").reverse();
    });
    eleventyConfig.addCollection("projects", function(collectionApi) {
      return collectionApi.getFilteredByGlob("src/projects/*.md");
    });

    eleventyConfig.addGlobalData("permalink", () => {
    return (data) => {
      return `${data.page.filePathStem}.html`;
    };
  });
    
    return {
        dir: {
            input: 'src',
            output: 'public',
            includes: '_includes',
        }
    };
};