import Navigation from "./Navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex" }}>
      <Navigation />
      <div className="page">
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
