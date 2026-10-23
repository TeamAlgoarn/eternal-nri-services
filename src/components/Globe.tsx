
export function Globe() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="globe-halo" />

      <div className="globe-circle">
        <div className="globe-lat globe-lat-top" />
        <div className="globe-lat globe-lat-bottom" />
        <div className="globe-meridian globe-meridian-left" />
        <div className="globe-meridian globe-meridian-right" />
        <div className="globe-center" />
      </div>

      <div className="art-orbit art-orbit-one" />
      <div className="art-orbit art-orbit-two" />

      <div className="art-point art-point-one" />
      <div className="art-point art-point-two" />
      <div className="art-point art-point-three" />

      <div className="art-caption">
        <span>CONNECTED TO HOME</span>
        <strong>Wherever life takes you.</strong>
      </div>
    </div>
  );
}
