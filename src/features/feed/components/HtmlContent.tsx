import React from 'react';
import { useWindowDimensions, Linking } from 'react-native';
import RenderHtml, { type MixedStyleDeclaration } from 'react-native-render-html';

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
};

interface HtmlContentProps {
  html: string;
  baseStyle?: MixedStyleDeclaration;
}

export default function HtmlContent({ html, baseStyle }: HtmlContentProps) {
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
      source={{ html }}
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
