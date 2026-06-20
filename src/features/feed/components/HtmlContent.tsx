import React from 'react';
import { useWindowDimensions, Linking } from 'react-native';
import RenderHtml, { type MixedStyleDeclaration } from 'react-native-render-html';
import { marked } from 'marked';

marked.setOptions({ breaks: true, gfm: true });

const BASE_STYLE: MixedStyleDeclaration = {
  fontSize: 15,
  lineHeight: 22,
  color: '#1a1a1a',
};

const TAGS_STYLES: Record<string, MixedStyleDeclaration> = {
  a: { color: '#2563eb', textDecorationLine: 'underline' },
  img: { marginVertical: 8, alignSelf: 'center' },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: '#ddd',
    paddingLeft: 12,
    marginVertical: 8,
    color: '#666',
  },
  code: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 4,
    borderRadius: 4,
    fontFamily: 'monospace',
    fontSize: 13,
  },
  h1: { fontSize: 22, fontWeight: '700', marginVertical: 8, color: '#111' },
  h2: { fontSize: 19, fontWeight: '700', marginVertical: 6, color: '#111' },
  h3: { fontSize: 17, fontWeight: '600', marginVertical: 4, color: '#111' },
  li: { marginBottom: 4 },
  em: { fontStyle: 'italic', color: '#555' },
  strong: { fontWeight: '700' },
};

function preprocessHtml(raw: string): string {
  return raw.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (_, content: string) => {
    const decoded = content
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    return marked.parse(decoded) as string;
  });
}

interface HtmlContentProps {
  html: string;
  baseStyle?: MixedStyleDeclaration;
}

export default function HtmlContent({ html, baseStyle }: HtmlContentProps) {
  const processed = preprocessHtml(html);
  const { width } = useWindowDimensions();
  const contentWidth = width - 32;

  const renderersProps = {
    a: {
      onPress: (_event: unknown, href: string) => {
        if (href) {
          Linking.openURL(href);
        }
      },
    },
    img: {
      enableExperimentalPercentWidth: true,
    },
  };

  return (
    <RenderHtml
      contentWidth={contentWidth}
      source={{ html: processed }}
      baseStyle={{ ...BASE_STYLE, ...baseStyle }}
      tagsStyles={TAGS_STYLES}
      enableExperimentalBRCollapsing
      enableExperimentalMarginCollapsing
      ignoredDomTags={['script', 'style', 'iframe', 'form', 'input', 'button', 'select', 'textarea', 'object', 'embed']}
      renderersProps={renderersProps}
      defaultTextProps={{ selectable: true }}
    />
  );
}
