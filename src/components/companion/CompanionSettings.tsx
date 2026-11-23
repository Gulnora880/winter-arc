import { Modal } from "../Modal";
import { useCompanionVoice } from "../../hooks/useCompanionVoice";

export function CompanionSettings({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { settings, voices, updateVoice } = useCompanionVoice();

  return (
    <Modal open={open} onClose={onClose} title="Голос компаньона">
      <div className="space-y-4">
        <label className="flex items-center justify-between">
          <span>Включить голос</span>
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => updateVoice({ enabled: e.target.checked })}
          />
        </label>
        <div>
          <label className="label">
            Громкость: {Math.round(settings.volume * 100)}%
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.volume}
            onChange={(e) =>
              updateVoice({ volume: parseFloat(e.target.value) })
            }
            className="w-full"
          />
        </div>
        <div>
          <label className="label">
            Скорость речи: {settings.rate.toFixed(2)}
          </label>
          <input
            type="range"
            min={0.5}
            max={1.6}
            step={0.05}
            value={settings.rate}
            onChange={(e) => updateVoice({ rate: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
        <div>
          <label className="label">Голос</label>
          <select
            className="input"
            value={settings.voiceName ?? ""}
            onChange={(e) => updateVoice({ voiceName: e.target.value || null })}
          >
            <option value="">Автоматически</option>
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Тихие часы с</label>
            <input
              type="number"
              min={0}
              max={23}
              className="input"
              value={settings.quietHoursStart}
              onChange={(e) =>
                updateVoice({ quietHoursStart: parseInt(e.target.value) })
              }
            />
          </div>
          <div>
            <label className="label">до</label>
            <input
              type="number"
              min={0}
              max={23}
              className="input"
              value={settings.quietHoursEnd}
              onChange={(e) =>
                updateVoice({ quietHoursEnd: parseInt(e.target.value) })
              }
            />
          </div>
        </div>
        <p className="text-xs text-muted">
          Голос использует встроенный Web Speech API вашего браузера. Работает
          офлайн, ничего не отправляет на сервер. Разрешение на звук браузер
          может запросить при первом воспроизведении.
        </p>
      </div>
    </Modal>
  );
}
