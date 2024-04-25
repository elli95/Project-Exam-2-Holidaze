import FooterSection from "../FooterSection";
import HeaderNav from "../HeaderNav";

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
