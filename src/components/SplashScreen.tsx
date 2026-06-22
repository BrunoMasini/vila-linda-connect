import { useEffect, useState } from "react";
import { versiculos } from "@/data/versiculos";

const STORAGE_KEY = "splash-seen";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [versiculo, setVersiculo] = useState(versiculos[0]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    setVersiculo(versiculos[Math.floor(Math.random() * versiculos.length)]);
    setVisible(true);
  }, []);

  function dismiss() {
    setFading(true);
    sessionStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => setVisible(false), 450);
  }

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={dismiss}
      aria-label="Entrar no site"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy-gradient px-6 text-center transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="max-w-3xl">
        <p className="font-display text-2xl font-medium leading-relaxed text-white sm:text-3xl md:text-4xl">
          “{versiculo.texto}”
        </p>
        <p className="mt-8 text-lg font-semibold tracking-wide text-gold sm:text-xl">
          {versiculo.referencia}
        </p>
      </div>
      <p className="absolute bottom-10 text-xs uppercase tracking-[0.3em] text-white/60">
        Clique sobre o versículo para entrar
      </p>
    </button>
  );
}
