import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MfoSatellite, MfoSatellitePayload } from "../services/MfoSatellite/mfoSatelliteTypes";
import MfoSatelliteService from "../services/MfoSatellite/MfoSatelliteService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  satelliteData?: MfoSatellite;
  onSubmitSuccess: () => void;
}

export default function SatelliteModal({ isOpen, onClose, mode, satelliteData, onSubmitSuccess }: Props) {
  const [satelliteName, setSatelliteName] = useState("");
  const [satelliteType, setSatelliteType] = useState("");
  const [mfoId, setMfoId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && satelliteData) {
      setSatelliteName(satelliteData.satelliteName);
      // setSatelliteType(satelliteData.satelliteType);
      setMfoId(satelliteData.mfoId);
    } else {
      setSatelliteName("");
      setSatelliteType("");
      setMfoId("");
    }
  }, [mode, satelliteData, isOpen]);

  const validate = () => {
    if (!satelliteName.trim() || !satelliteType.trim() || mfoId === "") {
      toast.error("Заполните все поля");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    const payload: MfoSatellitePayload = {
      satelliteName: satelliteName.trim(),
      // satelliteType: satelliteType.trim(),
      mfoId: Number(mfoId),
    };

    try {
      if (mode === "create") {
        await MfoSatelliteService.createSatellite(payload);
        toast.success("Сателлит создан");
      } else if (mode === "edit" && satelliteData) {
        await MfoSatelliteService.updateSatellite(satelliteData.id, payload);
        toast.success("Сателлит обновлён");
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
          {mode === "create" ? "Создать сателлит" : "Редактировать сателлит"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Название сателлита</label>
            <input
              type="text"
              value={satelliteName}
              onChange={(e) => setSatelliteName(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Тип сателлита</label>
            <input
              type="text"
              value={satelliteType}
              onChange={(e) => setSatelliteType(e.target.value)}
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
