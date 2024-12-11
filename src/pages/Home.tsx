export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 160px)",
      }}
    >
      <h1 style={{ color: "#14cc76" }}>
        Trinidad Wiseman{" "}
        <div style={{ textTransform: "none", color: "white" }}>
          {" "}
          SPA proovitöö{" "}
        </div>
      </h1>
      <h2>by KENET KAUKSI</h2>
    </div>
  );
}
