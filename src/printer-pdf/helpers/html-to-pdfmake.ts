import htmlToPdfmake from 'html-to-pdfmake';
import axios from 'axios';
import { JSDOM } from 'jsdom';

interface ContentReplacer {
  [key: string]: string;
}

// Record<string, string> is the same as { [key: string]: string }

export const getHtmlContent = (
  html: string,
  replacers: ContentReplacer = {},
): any => {
  Object.entries(replacers).forEach(([key, value]) => {
    const key1 = `{{ ${key} }}`;
    const key2 = `{{${key}}}`;

    html = html.replaceAll(key1, value).replaceAll(key2, value);
  });

  const { window } = new JSDOM();

  return htmlToPdfmake(html, { window });
};

interface ChartOptions {
  height?: number;
  width?: number;
}

export const chartJsToImage = async (
  chartConfig: unknown,
  options: ChartOptions = {},
) => {
  const params = new URLSearchParams();

  if (options.height) params.append('height', options.height.toString());
  if (options.width) params.append('width', options.width.toString());

  const encodedUri = encodeURIComponent(JSON.stringify(chartConfig));

  const chartUrl = `https://quickchart.io/chart?c=${encodedUri}&${params.toString()}`;

  const response = await axios.get(chartUrl, { responseType: 'arraybuffer' });

  return `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;
};
