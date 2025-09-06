function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <p>© {new Date().getFullYear()} CollegeConnect. All rights reserved.</p>
      <a href="mailto:yashd1773@gmail.com?subject=CollegeConnect Inquiry" className="text-white">
        Contact Us
      </a>
    </footer>
  );
}

export default Footer;
