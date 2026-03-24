import React from 'react';
import SEO from './SEO';

type Props = {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export default function Layout({ header, footer, children }: Props) {
  return (
    <div className="min-h-screen bg-app text-app">
      <SEO />
      {header ? <header className="w-full">{header}</header> : null}
      <main className="layout-main">{children}</main>
      {footer ? <footer className="mt-12">{footer}</footer> : null}
    </div>
  );
}
