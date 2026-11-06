export default function Header({ settings }) {
  return (
    <header>
      <div className="tag">🎮 {settings.siteTitle}</div>
      <h1>{settings.headline}</h1>
      <div className="event clip">🎮 {settings.eventTitle} · {settings.eventTime}</div>
    </header>
  );
}
