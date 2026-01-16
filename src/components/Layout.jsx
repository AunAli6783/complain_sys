import React from "react";

export default function Layout({ children }) {
  return (
    <div>
      <main className="container">{children}</main>
    </div>
  );
}