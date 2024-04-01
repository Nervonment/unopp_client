export default function LoggedOutLayout({ children }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      {children}
    </div>
  )
}