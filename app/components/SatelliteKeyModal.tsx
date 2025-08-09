import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MfoSatelliteKey, MfoSatelliteKeyPayload } from "../services/MfoSatelliteKey/mfoSatelliteKeyTypes";
import MfoSatelliteKeyService from "../services/MfoSatelliteKey/MfoSatelliteKeyService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  keyData?: MfoSatelliteKey;
  onSubmitSuccess: () => void;
}

export default function SatelliteKeyModal({ isOpen, onClose, mode, keyData, onSubmitSuccess }: Props) {
  const [keyName, setKeyName] = useState("");
  const [keyValue, setKeyValue] = useState("");
  const [mfoId, setMfoId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && keyData) {
      setKeyName(keyData.keyName);
      setKeyValue(keyData.keyValue);
      setMfoId(keyData.mfoId);
    } else {
      setKeyName("");
      setKeyValue("");
      setMfoId("");
    }
  }, [mode, keyData, isOpen]);

  const validate = () => {
    if (!keyName.trim() || !keyValue.trim() || mfoId === "") {
      toast.error("Заполните все поля");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    const payload: MfoSatelliteKeyPayload = {
      keyName: keyName.trim(),
      keyValue: keyValue.trim(),
      mfoId: Number(mfoId),
    };

    try {
      if (mode === "create") {
        await MfoSatelliteKeyService.createSatelliteKey(payload);
        toast.success("Ключ создан");
      } else if (mode === "edit" && keyData) {
        await MfoSatelliteKeyService.updateSatelliteKey(keyData.id, payload);
        toast.success("Ключ обновлён");
      }
      onSubmitSuccess();
      onClose();
    } catch {
      toast.error("Ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "create" ? "Создать ключ сателлита" : "Редактировать ключ сателлита"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Название ключа</label>
            <input
              type="text"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Значение ключа</label>
            <input
              type="text"
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ID МФО</label>
            <input
              type="number"
              value={mfoId}
              onChange={(e) => setMfoId(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {loading ? "Сохраняем..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}
