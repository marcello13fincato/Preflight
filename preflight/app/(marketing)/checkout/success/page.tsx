export default function CheckoutSuccess() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-app">Grazie per l’acquisto!</h1>
        <p className="mt-4 text-muted">
          Ora puoi tornare all&apos;app e iniziare a usare il sistema.
        </p>
        <a href="/app" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-white font-semibold hover:bg-primary-dark transition">
          Vai all&apos;app
        </a>
      </div>
    </main>
  );
}
