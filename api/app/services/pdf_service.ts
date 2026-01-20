import { chromium } from 'playwright';
import edge from 'edge.js';

export default class PdfService {
  static async loadView(viewName: string, data: any) {
    const html = await edge.render(viewName, data);

    const browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });

    const buffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    return {
      stream(filename: string) {
        return {
          buffer,
          disposition: `inline; filename="${filename}"`,
        };
      },

      download(filename: string) {
        return {
          buffer,
          disposition: `attachment; filename="${filename}"`,
        };
      },
    };
  }
}
