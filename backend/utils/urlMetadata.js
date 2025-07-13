const axios = require("axios");
const cheerio = require("cheerio");

const fetchUrlMetadata = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    const title =
      $("title").text().trim() ||
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      "Untitled";

    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      "";

    const favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      `${new URL(url).origin}/favicon.ico`;

    return {
      title: title.substring(0, 200),
      description: description.substring(0, 1000),
      favicon: favicon.startsWith("http")
        ? favicon
        : new URL(favicon, url).href,
    };
  } catch (error) {
    console.error("Error fetching URL metadata:", error.message);
    return {
      title: new URL(url).hostname,
      description: "",
      favicon: `${new URL(url).origin}/favicon.ico`,
    };
  }
};

module.exports = { fetchUrlMetadata };
