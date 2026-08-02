
export default function HomePage() {
  return (
    <div
      className='min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6'
      style={{ paddingTop: 150, paddingBottom: 80 }}
    >
      <h1
        className='text-navy text-4xl font-bold'
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Shell is working.
      </h1>
      <p className='text-muted text-base max-w-md leading-relaxed'>
        Navbar, footer, and preloader are live. Replace this file with the full
        home page in the next step.
      </p>
    </div>
  );
}
