/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { DropdownWithSearch } from "../ui/Dropdowns/DropdownWithSearch";
import MfoSatelliteKeyService from "../services/MfoSatelliteKey/MfoSatelliteKeyService";

interface SatelliteModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  satellite?: any;
  onSubmitSuccess: () => void;
}

export default function SatelliteModal({
  isOpen,
  onClose,
  mode,
  satellite,
  onSubmitSuccess,
}: SatelliteModalProps) {
  const [formData, setFormData] = useState({
    keyId: satellite?.keyId || "",
    metaTitleUk: satellite?.metaTitleUk || "",
    metaTitleRu: satellite?.metaTitleRu || "",
    metaDescUk: satellite?.metaDescUk || "",
    metaDescRu: satellite?.metaDescRu || "",
    titleUk: satellite?.titleUk || "",
    titleRu: satellite?.titleRu || "",
    descriptionUk: satellite?.descriptionUk || "",
    descriptionRu: satellite?.descriptionRu || "",
    slugUk: satellite?.slugUk || "",
    slugRu: satellite?.slugRu || "",
  });

  useEffect(() => {
    if (mode === "edit" && satellite) {
      setFormData({
        keyId: satellite.keyId || "",
        metaTitleUk: satellite.metaTitleUk || "",
        metaTitleRu: satellite.metaTitleRu || "",
        metaDescUk: satellite.metaDescUk || "",
        metaDescRu: satellite.metaDescRu || "",
        titleUk: satellite.titleUk || "",
        titleRu: satellite.titleRu || "",
        descriptionUk: satellite.descriptionUk || "",
        descriptionRu: satellite.descriptionRu || "",
        slugUk: satellite.slugUk || "",
        slugRu: satellite.slugRu || "",
      });
    } else {
      setFormData({
        keyId: "",
        metaTitleUk: "",
        metaTitleRu: "",
        metaDescUk: "",
        metaDescRu: "",
        titleUk: "",
        titleRu: "",
        descriptionUk: "",
        descriptionRu: "",
        slugUk: "",
        slugRu: "",
      });
    }
  }, [satellite, mode, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        keyId: Number(formData.keyId) || 0,
      };

      // Здесь должен быть ваш API сервис
      if (mode === "create") {
        // await SatelliteService.createSatellite(payload);
        toast.success("Сателлит успешно создан");
      } else {
        // await SatelliteService.updateSatellite(satellite?.id, payload);
        toast.success("Сателлит успешно обновлён");
      }

      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error("Ошибка при сохранении сателлита:", error);
      toast.error("Ошибка при сохранении сателлита");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] scrollbar-none overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {mode === "create"
                ? "Создать сателлит"
                : "Редактировать сателлит"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <DropdownWithSearch
            label="Ключ сателлита"
            value={formData.keyId}
            onSelect={(id) =>
              setFormData({ ...formData, keyId: id.toString() })
            }
            placeholder="Выберите ключ сателлита..."
            searchPlaceholder="Поиск ключей..."
            onSearch={async (query) => {
              const results = await MfoSatelliteKeyService.searchSatelliteKeys(
                query
              );
              return results.map((item) => ({
                id: item.id,
                name: item.keyRu, // или keyUk
              }));
            }}
            onLoadOption={async (id) => {
              const data = await MfoSatelliteKeyService.getSatelliteKey(
                Number(id)
              );
              return { id: data.id, name: data.keyRu };
            }}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meta Title (укр.)
              </label>
              <input
                name="metaTitleUk"
                type="text"
                value={formData.metaTitleUk}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meta Title (рус.)
              </label>
              <input
                name="metaTitleRu"
                type="text"
                value={formData.metaTitleRu}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meta Description (укр.)
              </label>
              <textarea
                name="metaDescUk"
                value={formData.metaDescUk}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meta Description (рус.)
              </label>
              <textarea
                name="metaDescRu"
                value={formData.metaDescRu}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Заголовок (укр.)
              </label>
              <input
                name="titleUk"
                type="text"
                value={formData.titleUk}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Заголовок (рус.)
              </label>
              <input
                name="titleRu"
                type="text"
                value={formData.titleRu}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Описание (укр.)
              </label>
              <textarea
                name="descriptionUk"
                value={formData.descriptionUk}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Описание (рус.)
              </label>
              <textarea
                name="descriptionRu"
                value={formData.descriptionRu}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Слаг (укр.)
              </label>
              <input
                name="slugUk"
                type="text"
                value={formData.slugUk}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Слаг (рус.)
              </label>
              <input
                name="slugRu"
                type="text"
                value={formData.slugRu}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
