import TopBar from "../TopBar";
import NavBar from "../NavBar";

export default function Header() {
  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <TopBar />
      <NavBar />
    </header>
  );
}
