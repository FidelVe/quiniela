import type { Metadata } from "next";
import { ShareActions } from "@/components/share-actions";
import {
  POINTS_WIN,
  POINTS_TIE,
  POINTS_EXACT_BONUS,
} from "@/lib/scoring";

export const metadata: Metadata = {
  title: "Reglas — Quiniela 26",
};

export default function InfoPage() {
  return (
    <section>
      <header className="mb-10 md:mb-14 flex items-end justify-between gap-6 border-b border-edge pb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-flame mb-2">Las reglas</p>
          <h1 className="display text-7xl md:text-[9rem] text-paper">Info</h1>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="hidden md:block text-right text-xs uppercase tracking-[0.3em] text-mute">
            <p>Fase de grupos</p>
            <p className="mt-1">72 partidos</p>
          </div>
          <ShareActions title="Reglas — Quiniela 26" />
        </div>
      </header>

      <div className="space-y-12">
        <Block title="Cómo funciona">
          <p>
            Cada participante pronostica el marcador de los 72 partidos de la
            fase de grupos del Mundial 2026. El organizador registra los
            pronósticos y los resultados oficiales; los puntos se calculan
            solos.
          </p>
        </Block>

        <Block title="Puntos">
          <ul className="space-y-3">
            <Rule pts={`+${POINTS_WIN}`}>
              Acertar el ganador del partido (sin el marcador exacto).
            </Rule>
            <Rule pts={`+${POINTS_TIE}`}>
              Acertar un empate (sin el marcador exacto).
            </Rule>
            <Rule pts={`+${POINTS_EXACT_BONUS}`}>
              Bono por marcador exacto, sobre los puntos del resultado.
            </Rule>
          </ul>
          <p className="mt-5 text-mute">
            Ejemplos — marcador exacto de una victoria:{" "}
            <span className="text-paper">
              {POINTS_WIN + POINTS_EXACT_BONUS} pts
            </span>
            ; marcador exacto de un empate:{" "}
            <span className="text-paper">
              {POINTS_TIE + POINTS_EXACT_BONUS} pts
            </span>
            .
          </p>
        </Block>

        <Block title="Desempate">
          <ol className="space-y-3 list-none">
            <Rule pts="1°">Más puntos.</Rule>
            <Rule pts="2°">Más marcadores exactos.</Rule>
            <Rule pts="3°">
              Goles totales: gana quien tenga la suma de goles pronosticados
              más cercana al total oficial de goles de la fase de grupos. Los
              goles de cada participante y el total oficial se muestran en la
              tabla de posiciones.
            </Rule>
          </ol>
        </Block>

        <Block title="Horarios">
          <p>
            Todos los horarios se muestran en hora de Venezuela
            (GMT-4).
          </p>
        </Block>

        <Block title="¿Quieres jugar?">
          <p>
            Si quieres participar, comunícate con{" "}
            <span className="text-flame">Chande</span>.
          </p>
        </Block>
      </div>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-edge bg-coal px-5 md:px-8 py-6 md:py-8">
      <h2 className="text-[10px] uppercase tracking-[0.5em] text-flame mb-4">{title}</h2>
      <div className="text-sm md:text-base text-paper/90 leading-relaxed">{children}</div>
    </div>
  );
}

function Rule({ pts, children }: { pts: string; children: React.ReactNode }) {
  return (
    <li className="flex items-baseline gap-4">
      <span className="score-num text-xl md:text-2xl text-jade glow-jade min-w-[3rem] text-right">
        {pts}
      </span>
      <span>{children}</span>
    </li>
  );
}
