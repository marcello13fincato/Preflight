export default function CheckoutCancel() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary">Pagamento annullato</h1>
        <p className="mt-4 text-text-secondary">
          Il pagamento non è andato a buon fine. Riprova o contatta il supporto.
        </p>
        <a href="/pricing" className="mt-6 inline-block rounded-full border border-border px-6 py-3 text-text-primary hover:bg-background-alt transition">
          Torna ai prezzi
        </a>
      </div>
    </main>
  );
}
