export default function CheckoutCancel() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-app">Pagamento annullato</h1>
        <p className="mt-4 text-muted">
          Il pagamento non è andato a buon fine. Riprova o contatta il supporto.
        </p>
        <a href="/pricing" className="mt-6 inline-block rounded-full border border-app px-6 py-3 text-app hover:bg-surface transition">
          Torna ai piani
        </a>
      </div>
    </main>
  );
}
