import MenuNav from "../MenuNav";

function Layout({ children }) {
  return (
    <div>
      <MenuNav />
      <main>{children}</main>
    </div>
  );
}

export default Layout;
