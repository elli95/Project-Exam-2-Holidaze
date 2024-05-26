import FooterSection from "../FooterSection";
import HeaderNav from "../HeaderNav";

/**
 * Layout component that serves as a wrapper for the main content of the application.
 * It includes the header navigation at the top and the footer section at the bottom.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The layout component with a header, main content, and footer.
 */
function Layout({ children }) {
  return (
    <div>
      <HeaderNav />
      <main>{children}</main>
      <FooterSection />
    </div>
  );
}

export default Layout;
