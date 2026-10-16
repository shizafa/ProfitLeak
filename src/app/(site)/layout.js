export const metadata = {
  title: 'Profit Leak',
  description: 'Profit Leak is a powerful tool that helps businesses identify and eliminate revenue leaks, optimize pricing strategies, and maximize profitability. With advanced analytics and actionable insights, Profit Leak empowers companies to make data-driven decisions and drive sustainable growth.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <link href="/css/tiny-slider.css" rel="stylesheet" />
        <link href="/css/tobii.min.css" rel="stylesheet" type="text/css" />
        <link href="/css/materialdesignicons.min.css" rel="stylesheet" type="text/css" />
        <link href="/css/unicons-line.css" rel="stylesheet" />
        <link href="/css/style.min.css" rel="stylesheet" type="text/css" id="theme-opt" />
        <link href="/css/colors/default.css" rel="stylesheet" id="color-opt" />
      </head>
      <body>{children}</body>
    </html>
  );
}
