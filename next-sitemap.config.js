// /** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: "https://learningdestiny.in/", // Replace with your actual domain
    generateRobotsTxt: true, // Generates robots.txt
    sitemapSize: 5000, // Ensures splitting if needed
    outDir: "./public",
    async additionalPaths(config) {
      const languages = ["en-in", "en-ae", "en-us"]; // List of languages/regions you support
   
      const dynamicRoutes = [
        "https://learningdestiny.in/", // Home page
        "https://learningdestiny.in/Courses", // Example services page
        "https://learningdestiny.in/Events",
        "https://learningdestiny.in/workshop",
        "https://learningdestiny.in/inten",
        "https://learningdestiny.in/Careers",
        "https://learningdestiny.in/sign-in",
        "https://learningdestiny.in/graduate-roles",
        "https://learningdestiny.in/Login",
      
      ]; // Base dynamic routes 
   
      // Generate routes for all languages/regions
      const allRoutes = [];
      dynamicRoutes.forEach((route) => {
        languages.forEach((lang) => {
          allRoutes.push(route.replace("/en-in", `/${lang}`)); // Replace the dynamic part with language-region
        });
      });
   
      // Add additional parameters (priority, changefreq)
      return allRoutes.map((route) => {
        let priority = 0.5; // Default priority
        let changefreq = "weekly"; // Default changefreq
   
        // Example: Adjust priority and changefreq for specific pages
        if (route.includes("/services")) {
          priority = 0.8; // Services pages are more important
          changefreq = "monthly"; // Services might update less frequently
        } else if (route.includes("/about-us")) {
          priority = 0.7; // About us pages have moderate priority
          changefreq = "yearly"; // About us content generally doesn't change often
        } else if (route.includes("/contact-us")) {
          priority = 0.9; // Contact pages are very important
          changefreq = "weekly"; // Contact pages might change more often (e.g., phone number, contact form)
        }
   
        return {
          loc: route,
          lastmod: new Date().toISOString(),
          priority: priority, // Add priority here
          changefreq: changefreq, // Add changefreq here
        };
      });
    },
  };
   