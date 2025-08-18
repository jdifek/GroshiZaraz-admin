import { Expert } from "@/app/services/experts/expertsTypes";
import { DeleteButton } from "@/app/ui/Buttons/DeleteButton";
import { EditButton } from "@/app/ui/Buttons/EditButton";
import { ExpandCollapseButton } from "@/app/ui/Buttons/ExpandCollapseButton";
import {
  Globe,
  Star,
  Award,
  Users,
  TrendingUp,
  Mail,
  MessageCircle,
  Linkedin,
  Twitter,
  Link,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";

type Props = {
  expert: Expert;
  handleDelete: (id: string) => Promise<void>;
  isExpanded: boolean;
  toggleCardExpansion: (expertId: number) => void;
  openModal: (mode: "create" | "edit", expert?: Expert) => void;
};

export const ExpertCard: React.FC<Props> = ({
  expert,
  isExpanded,
  handleDelete,
  toggleCardExpansion,
  openModal,
}) => {
  return (
    <div
      key={expert.id}
      className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-4 flex-1">
          <div className="w-16 h-16 rounded-full overflow-hidden">
  <Image
    src={expert.avatar}
    alt="Avatar"
    width={64}
    height={64}
    className="object-cover"
  />
</div>
            <div className="flex-1 min-w-0">
              {/* Основная информация - всегда видна */}
              <div className="flex items-start gap-3 mb-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-800">
                      {expert.name}
                    </h3>
                    {expert.isActive ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  {expert.nameUk && (
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-600">
                        UK: {expert.nameUk}
                      </span>
                    </div>
                  )}
                  {expert.position && (
                    <p className="text-sm text-gray-600 font-medium mb-2">
                      {expert.position}
                    </p>
                  )}
                </div>
              </div>

              {/* Краткая информация - всегда видна */}
              <div className="mb-4 text-sm text-gray-600 space-y-2">
                <div className="line-clamp-2">{expert.bio}</div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                    <span>{expert.totalAnswers || 0} ответов</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span>{expert.isActive ? "Активный" : "Неактивный"}</span>
                  </div>
                </div>
              </div>

              {/* Детальная информация - показывается при разворачивании */}
              <div
                className={`space-y-4 transition-all duration-300 overflow-hidden ${
                  isExpanded ? "max-h-none opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {/* Полная биография */}
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Биография
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {expert.bio}
                  </p>
                  {expert.bioUk && expert.bioUk !== expert.bio && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">
                          Биография UK
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 leading-relaxed">
                        {expert.bioUk}
                      </p>
                    </div>
                  )}
                </div>

                {/* Должность и опыт */}
                {(expert.position || expert.experience) && (
                  <div className="p-4 bg-violet-50 rounded-lg border-l-4 border-violet-400">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-violet-600" />
                      <span className="text-sm font-medium text-violet-700">
                        Карьера и опыт
                      </span>
                    </div>

                    {expert.position && (
                      <div className="mb-3">
                        <div className="text-sm font-medium text-violet-800 mb-1">
                          Должность:
                        </div>
                        <div className="text-sm text-violet-700">
                          {expert.position}
                        </div>
                        {expert.positionUk &&
                          expert.positionUk !== expert.position && (
                            <div className="text-xs text-violet-600 mt-1">
                              UK: {expert.positionUk}
                            </div>
                          )}
                      </div>
                    )}

                    {expert.experience && (
                      <div>
                        <div className="text-sm font-medium text-violet-800 mb-1">
                          Опыт работы:
                        </div>
                        <div className="text-sm text-violet-700">
                          {expert.experience}
                        </div>
                        {expert.experienceUk &&
                          expert.experienceUk !== expert.experience && (
                            <div className="text-xs text-violet-600 mt-1">
                              UK: {expert.experienceUk}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                )}

                {/* Экспертиза */}
                {expert.expertise && expert.expertise.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">
                        Экспертиза
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {expert.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white text-blue-700 text-sm rounded-full border border-blue-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {expert.expertiseUk && expert.expertiseUk.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="text-sm font-medium text-blue-800 mb-2">
                          Экспертиза UK:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {expert.expertiseUk.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Достижения */}
                {expert.achievements && expert.achievements.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Достижения
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      {expert.achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-green-700"
                        >
                          <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>

                    {expert.achievementsUk &&
                      expert.achievementsUk.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="text-sm font-medium text-green-800 mb-2">
                            Достижения UK:
                          </div>
                          <div className="space-y-2">
                            {expert.achievementsUk.map((achievement, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-sm text-green-700"
                              >
                                <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                                <span>{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* Статистика */}
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-700">
                      Статистика
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-lg font-bold text-gray-800">
                        {expert.totalAnswers || 0}
                      </div>
                      <div className="text-xs text-gray-500">Всего ответов</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-lg font-bold text-gray-800">
                        {expert.isActive ? "Да" : "Нет"}
                      </div>
                      <div className="text-xs text-gray-500">Активный</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-lg font-bold text-gray-800">
                        {expert.expertise?.length || 0}
                      </div>
                      <div className="text-xs text-gray-500">
                        Областей экспертизы
                      </div>
                    </div>
                  </div>
                </div>

                {/* Контактная информация */}
                {(expert.email ||
                  expert.telegram ||
                  expert.linkedin ||
                  expert.twitter) && (
                  <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
                    <div className="flex items-center gap-2 mb-3">
                      <Mail className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-medium text-indigo-700">
                        Контакты и социальные сети
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {expert.email && (
                        <a
                          href={`mailto:${expert.email}`}
                          className="flex items-center gap-2 p-2 bg-white rounded-lg text-indigo-700 hover:text-indigo-900 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="text-sm truncate">Email</span>
                        </a>
                      )}
                      {expert.telegram && (
                        <a
                          href={`https://t.me/${expert.telegram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-white rounded-lg text-indigo-700 hover:text-indigo-900 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm truncate">Telegram</span>
                        </a>
                      )}
                      {expert.linkedin && (
                        <a
                          href={`https://linkedin.com/in/${expert.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-white rounded-lg text-indigo-700 hover:text-indigo-900 transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                          <span className="text-sm truncate">LinkedIn</span>
                        </a>
                      )}
                      {expert.twitter && (
                        <a
                          href={`https://twitter.com/${expert.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-white rounded-lg text-indigo-700 hover:text-indigo-900 transition-colors"
                        >
                          <Twitter className="w-4 h-4" />
                          <span className="text-sm truncate">Twitter</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* SEO и служебная информация */}
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                  <div className="flex items-center gap-2 mb-3">
                    <Link className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Служебная информация
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">ID:</span> {expert.id}
                    </div>
                    {expert.slug && (
                      <div>
                        <span className="font-medium">Slug:</span> /
                        {expert.slug}
                      </div>
                    )}
                    {expert.color && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Цвет:</span>
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: expert.color }}
                        ></div>
                        <span className="font-mono text-xs">
                          {expert.color}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Создан:</span>{" "}
                      {new Date(expert.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Кнопки управления */}
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            {/* Кнопка разворачивания/сворачивания */}
            <ExpandCollapseButton
              isExpanded={isExpanded}
              onToggle={() => toggleCardExpansion(expert.id)}
            />

            <EditButton
              item={expert}
              handleClick={(expert) => openModal("edit", expert)}
            />
            <DeleteButton onClick={() => handleDelete(expert.id.toString())} />
          </div>
        </div>
      </div>
    </div>
  );
};
