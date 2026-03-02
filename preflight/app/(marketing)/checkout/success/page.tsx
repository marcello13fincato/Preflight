export default function CheckoutSuccess() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary">Grazie per l’acquisto!</h1>
        <p className="mt-4 text-text-secondary">
          Ora puoi tornare alla dashboard e cominciare a usare gli audit illimitati.
        </p>
        <a href="/dashboard" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-text-primary font-semibold hover:bg-primary-hover transition">
          Vai alla dashboard
        </a>
      </div>
    </main>
  );
}
