export async function getServerSideProps({ res }) {
    const EXTERNAL_DATA_URL = 'https://learningdestiny.in';
  
    try {
      const response = await fetch(`${EXTERNAL_DATA_URL}/api/posts`);
      const posts = await response.json();
  
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="https://learningdestiny.in/">
        <url>
          <loc>${EXTERNAL_DATA_URL}</loc>
        </url>
        <url>
          <loc>${EXTERNAL_DATA_URL}/guide</loc>
        </url>
        ${posts
          .map(({ id }) => `
            <url>
              <loc>${EXTERNAL_DATA_URL}/posts/${id}</loc>
            </url>
          `)
          .join('')}
      </urlset>`;
  
      res.setHeader('Content-Type', 'application/xml');
      res.write(sitemap);
      res.end();
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.setHeader('Content-Type', 'application/xml');
      res.write('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="https://learningdestiny.in/"></urlset>');
      res.end();
    }
  
    return { props: {} };
  }
  
  export default function Sitemap() {
    return null;
  }
  