// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en"> {/* Customize attributes of the <html> tag here */}
        <Head>
          {/* Add custom tags in the <head> here */}
        </Head>
        <body className="custom-class"> {/* Customize attributes of the <body> tag here */}
          <Main /> {/* This is where your app content will be rendered */}
          <NextScript /> {/* Next.js scripts will be injected here */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;