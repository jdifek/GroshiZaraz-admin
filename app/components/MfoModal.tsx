"use client";

import { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Mfo, MfoPayload } from "../services/mfos/mfoTypes";
import MfoService from "../services/mfos/mfosService";

interface PromoCode {
  code: string;
  discount: string;
  condition: string;
  validTill: string;
}

interface MfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  mfo?: Mfo;
  onSubmitSuccess: () => void;
}

export default function MfoModal({
  isOpen,
  onClose,
  mode,
  mfo,
  onSubmitSuccess,
}: MfoModalProps) {
  const [formData, setFormData] = useState<MfoPayload>({
    name: "",
    rating: 0,
    reviews: 0,
    logo: "",
    licenseNumber: "",
    isActive: true,
    minAmount: 0,
    maxAmount: 0,
    minTerm: 0,
    maxTerm: 0,
    rateMin: 0,
    rateMax: 0,
    approvalRate: 0,
    decisionTime: "",
    isFirstLoanZero: false,
    isInstantApproval: false,
    phone: "",
    website: "",
    description: "",
    ageFrom: 18,
    slug: "",
    UtmLink: "",
    ageTo: 65,
    citizenship: "РФ",
    documents: "Паспорт РФ",
    isNoIncomeProof: false,
    is24Support: false,
    isSafeTransactions: false,
    isFlexibleTerms: false,
    workTimeWeekdays: "",
    workTimeWeekend: "",
    workTimeOnline: "",
    // Новые поля
    dailyRate: 0,
    commission: 0,
    collateral: "Не требуется",
    decisionType: "Автоматическое",
    application: "Онлайн",
  });

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);

  useEffect(() => {
    if (mode === "edit" && mfo) {
      const { promoCodes: existingPromoCodes, ...rest } = mfo;
      setFormData({
        name: rest.name || "",
        rating: rest.rating || 0,
        reviews: rest.reviews || 0,
        logo: rest.logo || "",
        licenseNumber: rest.licenseNumber || "",
        isActive: rest.isActive ?? true,
        minAmount: rest.minAmount || 0,
        maxAmount: rest.maxAmount || 0,
        minTerm: rest.minTerm || 0,
        maxTerm: rest.maxTerm || 0,
        rateMin: rest.rateMin || 0,
        rateMax: rest.rateMax || 0,
        approvalRate: rest.approvalRate || 0,
        decisionTime: rest.decisionTime || "",
        isFirstLoanZero: rest.isFirstLoanZero ?? false,
        isInstantApproval: rest.isInstantApproval ?? false,
        phone: rest.phone || "",
        website: rest.website || "",
        description: rest.description || "",
        ageFrom: rest.ageFrom || 18,
        slug: rest.slug || "",
        UtmLink: rest.UtmLink || "", // ✅ тут важно правильно взять UTM
        ageTo: rest.ageTo || 65,
        citizenship: rest.citizenship || "РФ",
        documents: rest.documents || "Паспорт РФ",
        isNoIncomeProof: rest.isNoIncomeProof ?? false,
        is24Support: rest.is24Support ?? false,
        isSafeTransactions: rest.isSafeTransactions ?? false,
        isFlexibleTerms: rest.isFlexibleTerms ?? false,
        workTimeWeekdays: rest.workTimeWeekdays || "",
        workTimeWeekend: rest.workTimeWeekend || "",
        workTimeOnline: rest.workTimeOnline || "",
        dailyRate: rest.dailyRate || 0,
        commission: rest.commission || 0,
        collateral: rest.collateral || "Не требуется",
        decisionType: rest.decisionType || "Автоматическое",
        application: rest.application || "Онлайн",
      });
      setPromoCodes(existingPromoCodes || []);
    }
  }, [mode, mfo]);
  
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" && e.target instanceof HTMLInputElement
          ? e.target.checked
          : value,
    }));
  };

  const addPromoCode = () => {
    setPromoCodes([
      ...promoCodes,
      { code: "", discount: "", condition: "", validTill: "" },
    ]);
  };

  const removePromoCode = (index: number) => {
    setPromoCodes(promoCodes.filter((_, i) => i !== index));
  };

  const updatePromoCode = (
    index: number,
    field: keyof PromoCode,
    value: string
  ) => {
    const updated = [...promoCodes];
    updated[index] = { ...updated[index], [field]: value };
    setPromoCodes(updated);
  };

  const numericFields: (keyof MfoPayload)[] = [
    "rating",
    "reviews",
    "minAmount",
    "maxAmount",
    "minTerm",
    "maxTerm",
    "rateMin",
    "rateMax",
    "approvalRate",
    "ageFrom",
    "ageTo",
    "dailyRate",
    "commission",
  ];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedData = {
      ...formData,
      ...numericFields.reduce((acc, key) => {
        const val = formData[key];
        acc[key] = val !== "" ? Number(val) : 0;
        return acc;
      }, {} as Record<string, number>),
      promoCodes,
    } as MfoPayload;

    try {
      if (mode === "create") {
        await MfoService.createMfo(parsedData);
        toast.success("МФО успешно создана");
      } else if (mfo?.id) {
        await MfoService.updateMfo(mfo.id, parsedData);
        toast.success("МФО успешно обновлена");
      }
      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error("Ошибка при сохранении МФО:", error);
      toast.error("Ошибка при сохранении МФО");
    }
  };

  if (!isOpen) return null;

  const renderInput = (
    label: string,
    name: keyof MfoPayload,
    type = "text",
    step?: string | number,
    isTextarea = false,
    placeholder = ""
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {isTextarea ? (
        <textarea
          name={name}
          value={formData[name] as string}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
          rows={4}
        />
      ) : (
        <input
          name={name}
          type={type}
          step={step}
          placeholder={placeholder}
          value={formData[name] as string | number | undefined}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
        />
      )}
    </div>
  );

  const renderSelect = (
    label: string,
    name: keyof MfoPayload,
    options: { value: string; label: string }[]
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={formData[name] as string}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderCheckbox = (
    label: string,
    name: keyof MfoPayload,
    description?: string
  ) => (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <input
        name={name}
        type="checkbox"
        checked={formData[name] as boolean}
        onChange={handleChange}
        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Заголовок */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === "create" ? "Добавить новое МФО" : "Редактировать МФО"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-white rounded-full p-2 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Контент формы */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={onSubmit} className="p-6 space-y-8">
            {/* Основная информация */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Основная информация
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput(
                  "Название МФО *",
                  "name",
                  "text",
                  undefined,
                  false,
                  "Введите название МФО"
                )}
                {renderInput(
                  "Слаг (URL)",
                  "slug",
                  "text",
                  undefined,
                  false,
                  "mfo-slug"
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderInput("Рейтинг", "rating", "number", 0.1, false, "4.5")}
                {renderInput(
                  "Количество отзывов",
                  "reviews",
                  "number",
                  1,
                  false,
                  "150"
                )}
                {renderInput(
                  "Номер лицензии",
                  "licenseNumber",
                  "text",
                  undefined,
                  false,
                  "МКК-123456"
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput(
                  "URL логотипа",
                  "logo",
                  "url",
                  undefined,
                  false,
                  "https://example.com/logo.png"
                )}
                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                  <input
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive as boolean}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    МФО активно
                  </label>
                </div>
              </div>
              {renderInput(
                "Описание",
                "description",
                "text",
                undefined,
                true,
                "Краткое описание услуг МФО..."
              )}
            </div>

            {/* Условия займа */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Условия займа
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput(
                  "Минимальная сумма (₴)",
                  "minAmount",
                  "number",
                  1,
                  false,
                  "1000"
                )}
                {renderInput(
                  "Максимальная сумма (₴)",
                  "maxAmount",
                  "number",
                  1,
                  false,
                  "50000"
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput(
                  "Минимальный срок (дней)",
                  "minTerm",
                  "number",
                  1,
                  false,
                  "7"
                )}
                {renderInput(
                  "Максимальный срок (дней)",
                  "maxTerm",
                  "number",
                  1,
                  false,
                  "365"
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput(
                  "Минимальная ставка (%)",
                  "rateMin",
                  "number",
                  0.01,
                  false,
                  "0.5"
                )}
                {renderInput(
                  "Максимальная ставка (%)",
                  "rateMax",
                  "number",
                  0.01,
                  false,
                  "2.0"
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderInput(
                  "Ставка в день (%)",
                  "dailyRate",
                  "number",
                  0.01,
                  false,
                  "1.0"
                )}
                {renderInput(
                  "Комиссия (%)",
                  "commission",
                  "number",
                  0.01,
                  false,
                  "0"
                )}
                {renderInput(
                  "Процент одобрения (%)",
                  "approvalRate",
                  "number",
                  1,
                  false,
                  "85"
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput(
                  "Залог/Обеспечение",
                  "collateral",
                  "text",
                  undefined,
                  false,
                  "Не требуется"
                )}
                {renderInput(
                  "Время принятия решения",
                  "decisionTime",
                  "text",
                  undefined,
                  false,
                  "5 минут"
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSelect("Тип решения", "decisionType", [
                  { value: "Автоматическое", label: "Автоматическое" },
                  { value: "Ручное", label: "Ручное" },
                  { value: "Смешанное", label: "Смешанное" },
                ])}
                {renderSelect("Способ подачи заявки", "application", [
                  { value: "Онлайн", label: "Онлайн" },
                  { value: "Офлайн", label: "Офлайн" },
                  { value: "Онлайн и офлайн", label: "Онлайн и офлайн" },
                ])}
              </div>
            </div>

            {/* Требования к заемщику */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Требования к заемщику
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput(
                  "Возраст от (лет)",
                  "ageFrom",
                  "number",
                  1,
                  false,
                  "18"
                )}
                {renderInput(
                  "Возраст до (лет)",
                  "ageTo",
                  "number",
                  1,
                  false,
                  "65"
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput(
                  "Гражданство",
                  "citizenship",
                  "text",
                  undefined,
                  false,
                  "РФ"
                )}
                {renderInput(
                  "Необходимые документы",
                  "documents",
                  "text",
                  undefined,
                  false,
                  "Паспорт РФ, СНИЛС"
                )}
              </div>
            </div>

            {/* Преимущества и особенности */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Преимущества и особенности
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderCheckbox(
                  "Первый займ под 0%",
                  "isFirstLoanZero",
                  "Предоставляется льготная ставка для новых клиентов"
                )}
                {renderCheckbox(
                  "Мгновенное одобрение",
                  "isInstantApproval",
                  "Решение принимается автоматически за секунды"
                )}
                {renderCheckbox(
                  "Без справки о доходах",
                  "isNoIncomeProof",
                  "Не требуется подтверждение официального дохода"
                )}
                {renderCheckbox(
                  "Круглосуточная поддержка",
                  "is24Support",
                  "Техподдержка работает 24/7"
                )}
                {renderCheckbox(
                  "Безопасные транзакции",
                  "isSafeTransactions",
                  "Используются защищенные протоколы передачи данных"
                )}
                {renderCheckbox(
                  "Гибкие условия",
                  "isFlexibleTerms",
                  "Возможность досрочного погашения без штрафов"
                )}
              </div>
            </div>

            {/* Контактная информация */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Контактная информация
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput(
                  "Телефон",
                  "phone",
                  "tel",
                  undefined,
                  false,
                  "+7 (800) 555-35-35"
                )}
                {renderInput(
                  "Официальный сайт",
                  "website",
                  "url",
                  undefined,
                  false,
                  "https://example.com"
                )}
              </div>
            </div>

            {/* UTM-ссылка */}
<div className="space-y-6">
  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
    Маркетинг
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {renderInput(
      "UTM-ссылка",
      "UtmLink",
      "url",
      undefined,
      false,
      "https://example.com/?utm_source=..."
    )}
  </div>
</div>


            {/* График работы */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                График работы
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderInput(
                  "Будние дни",
                  "workTimeWeekdays",
                  "text",
                  undefined,
                  false,
                  "9:00 - 18:00"
                )}
                {renderInput(
                  "Выходные дни",
                  "workTimeWeekend",
                  "text",
                  undefined,
                  false,
                  "10:00 - 16:00"
                )}
                {renderInput(
                  "Онлайн сервис",
                  "workTimeOnline",
                  "text",
                  undefined,
                  false,
                  "24/7"
                )}
              </div>
            </div>

            {/* Промокоды */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  Промокоды
                </h3>
                <button
                  type="button"
                  onClick={addPromoCode}
                  className="flex items-center cursor-pointer gap-2 px-3 py-1 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Plus className="w-4 h-4 " />
                  Добавить промокод
                </button>
              </div>

              {promoCodes.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm">Промокоды не добавлены</p>
                  <p className="text-xs mt-1">
                    Нажмите "Добавить промокод" чтобы создать новый
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {promoCodes.map((promo, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">
                          Промокод #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removePromoCode(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Код
                          </label>
                          <input
                            type="text"
                            value={promo.code}
                            onChange={(e) =>
                              updatePromoCode(index, "code", e.target.value)
                            }
                            placeholder="PROMO2024"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Скидка
                          </label>
                          <input
                            type="text"
                            value={promo.discount}
                            onChange={(e) =>
                              updatePromoCode(index, "discount", e.target.value)
                            }
                            placeholder="1000₴ или 15%"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Условия применения
                        </label>
                        <input
                          type="text"
                          value={promo.condition}
                          onChange={(e) =>
                            updatePromoCode(index, "condition", e.target.value)
                          }
                          placeholder="Для новых клиентов, минимальная сумма 5000₴"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Действует до
                        </label>
                        <input
                          type="date"
                          value={promo.validTill}
                          onChange={(e) =>
                            updatePromoCode(index, "validTill", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Кнопки управления */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
              >
                {mode === "create" ? "Создать МФО" : "Сохранить изменения"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
