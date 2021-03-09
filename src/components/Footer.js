import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p>ⓒ {year} Junaid Ahmad</p>
    </footer>
  );
}

export default Footer;
