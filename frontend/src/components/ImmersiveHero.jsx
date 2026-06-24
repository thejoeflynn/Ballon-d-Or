// Full-bleed background-image hero band shared by Home, Standings and Matches.
// The band sizing (full-bleed escape, unified min-height, centered content) lives
// in the `.immersive-hero` / `.immersive-hero-content` base classes in theme.css;
// each page passes a `className` for its own photo + scrim and a `contentClassName`
// for content alignment.
export default function ImmersiveHero({ className = '', contentClassName = '', children }) {
  return (
    <section className={`immersive-hero ${className}`.trim()}>
      <div className={`immersive-hero-content ${contentClassName}`.trim()}>
        {children}
      </div>
    </section>
  );
}
