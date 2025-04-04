const EXTERNAL_DATA_URL = 'https://learningdestiny.in';

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Main website URLs -->
     <url>
       <loc>https://learningdestiny.in</loc>
     </url>
     <url>
       <loc>https://learningdestiny.in/guide</loc>
     </url>
     ${posts
       .map(({ id }) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/posts/${id}`}</loc>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

// Export the GET handler for sitemap generation
export async function GET(req, res) {
  try {
    // Fetch data from your site's API
    const response = await fetch(`${EXTERNAL_DATA_URL}/api/posts`);
    const posts = await response.json();

    // Generate the XML sitemap
    const sitemap = generateSiteMap(posts);

    // Set the response headers and return the sitemap
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Return an empty sitemap in case of failure
    const fallbackSitemap = generateSiteMap([]);
    return new Response(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}
