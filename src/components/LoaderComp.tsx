function LoaderComp() {
  return (
    <div
      className="window"
      style={{
        // position: "absolute",
        // top: 0,
        // left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1500, 
        // display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
      }}
    >
      <div className="logo">
        <p className="top">Microsoft</p>
        <p className="mid">
          Windows<span>XP</span>
        </p>
        <p className="bottom">Professional</p>
      </div>
      <div className="container">
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
    </div>
  );
}

export default LoaderComp;
