<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="sm">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Eleganote Sitemap</title>
        <style>
          body { font-family: system-ui, sans-serif; margin: 2rem; color: #1a1a1a; }
          h1 { font-size: 1.25rem; margin-bottom: 1rem; }
          table { border-collapse: collapse; width: 100%; max-width: 720px; }
          th, td { border: 1px solid #ddd; padding: 0.5rem 0.75rem; text-align: left; }
          th { background: #f5f5f5; }
          a { color: #2563eb; }
        </style>
      </head>
      <body>
        <h1>Eleganote XML Sitemap</h1>
        <table>
          <tr>
            <th>URL</th>
            <th>Change frequency</th>
            <th>Priority</th>
          </tr>
          <xsl:for-each select="sm:urlset/sm:url">
            <tr>
              <td><a href="{sm:loc}"><xsl:value-of select="sm:loc"/></a></td>
              <td><xsl:value-of select="sm:changefreq"/></td>
              <td><xsl:value-of select="sm:priority"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
