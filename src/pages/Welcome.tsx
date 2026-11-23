import { Link } from "react-router-dom";
import { ArrowRight, Snowflake } from "lucide-react";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-2xl text-center">
        <Snowflake
          className="mx-auto text-accent mb-6 animate-float"
          size={64}
        />
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
          WINTER <span className="text-accent">ARC</span>
        </h1>
        <p className="text-muted text-lg mb-10">
          92 дня дисциплины, привычек и личного роста. Погружайся в свою арку.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/register" className="btn-primary px-8 py-3 text-base">
            Начать челлендж <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-ghost px-8 py-3 text-base">
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}
