import { Author } from "@/app/services/authors/authorsTypes";
import { DeleteButton } from "@/app/ui/Buttons/DeleteButton";
import { EditButton } from "@/app/ui/Buttons/EditButton";
import { ExpandCollapseButton } from "@/app/ui/Buttons/ExpandCollapseButton";
import { formatNumber } from "@/app/utils/format";
import {
  FileText,
  Eye,
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
} from "lucide-react";

type Props = {
  author: Author;
  handleDelete: (id: string) => Promise<void>;
  isExpanded: boolean;
  toggleCardExpansion: (authorId: number) => void;
  openModal: (mode: "create" | "edit", author?: Author) => void
};
export const AuthorCard: React.FC<Props> = ({
  author,
  isExpanded,
  handleDelete,
  toggleCardExpansion,
  openModal
}) => {
  return (
    <div
      key={author.id}
      className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
              style={{ backgroundColor: author.color || "#8b5cf6" }}
            >
              {author.avatar || author.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              {/* Основная информация - всегда видна */}
              <div className="flex items-start gap-3 mb-3 flex-wrap">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {author.name}
                  </h3>
                  {author.nameUk && author.nameUk !== author.name && (
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-600">
                        UK: {author.nameUk}
                      </span>
                    </div>
                  )}
                  {author.position && (
                    <p className="text-sm text-gray-600 font-medium mb-2">
                      {author.position}
                    </p>
                  )}
                </div>
              </div>

              {/* Краткая информация - всегда видна */}
              <div className="mb-4 text-sm text-gray-600 space-y-2">
                <div className="line-clamp-2">{author.bio}</div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span>{author.totalPosts || 0} статей</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span>
                      {formatNumber(author.totalViews || 0)} просмотров
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>
                      {formatNumber(author.followers || 0)} подписчиков
                    </span>
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
                    {author.bio}
                  </p>
                  {author.bioUk && author.bioUk !== author.bio && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">
                          Биография UK
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 leading-relaxed">
                        {author.bioUk}
                      </p>
                    </div>
                  )}
                </div>

                {/* Должность и опыт */}
                {(author.position || author.experience) && (
                  <div className="p-4 bg-violet-50 rounded-lg border-l-4 border-violet-400">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-violet-600" />
                      <span className="text-sm font-medium text-violet-700">
                        Карьера и опыт
                      </span>
                    </div>

                    {author.position && (
                      <div className="mb-3">
                        <div className="text-sm font-medium text-violet-800 mb-1">
                          Должность:
                        </div>
                        <div className="text-sm text-violet-700">
                          {author.position}
                        </div>
                        {author.positionUk &&
                          author.positionUk !== author.position && (
                            <div className="text-xs text-violet-600 mt-1">
                              UK: {author.positionUk}
                            </div>
                          )}
                      </div>
                    )}

                    {author.experience && (
                      <div>
                        <div className="text-sm font-medium text-violet-800 mb-1">
                          Опыт работы:
                        </div>
                        <div className="text-sm text-violet-700">
                          {author.experience}
                        </div>
                        {author.experienceUk &&
                          author.experienceUk !== author.experience && (
                            <div className="text-xs text-violet-600 mt-1">
                              UK: {author.experienceUk}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                )}

                {/* Экспертиза */}
                {author.expertise && author.expertise.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">
                        Экспертиза
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {author.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white text-blue-700 text-sm rounded-full border border-blue-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {author.expertiseUk && author.expertiseUk.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="text-sm font-medium text-blue-800 mb-2">
                          Экспертиза UK:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {author.expertiseUk.map((skill, index) => (
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
                {author.achievements && author.achievements.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Достижения
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      {author.achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-green-700"
                        >
                          <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>

                    {author.achievementsUk &&
                      author.achievementsUk.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="text-sm font-medium text-green-800 mb-2">
                            Достижения UK:
                          </div>
                          <div className="space-y-2">
                            {author.achievementsUk.map((achievement, index) => (
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
                        {formatNumber(author.totalViews || 0)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Всего просмотров
                      </div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-lg font-bold text-gray-800">
                        {author.totalPosts || 0}
                      </div>
                      <div className="text-xs text-gray-500">Всего статей</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-lg font-bold text-gray-800">
                        {formatNumber(author.followers || 0)}
                      </div>
                      <div className="text-xs text-gray-500">Подписчиков</div>
                    </div>
                  </div>
                </div>

                {/* Контактная информация */}
                {(author.email ||
                  author.telegram ||
                  author.linkedin ||
                  author.twitter) && (
                  <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
                    <div className="flex items-center gap-2 mb-3">
                      <Mail className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-medium text-indigo-700">
                        Контакты и социальные сети
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {author.email && (
                        <a
                          href={`mailto:${author.email}`}
                          className="flex items-center gap-2 p-2 bg-white rounded-lg text-indigo-700 hover:text-indigo-900 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="text-sm truncate">Email</span>
                        </a>
                      )}
                      {author.telegram && (
                        <a
                          href={`https://t.me/${author.telegram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-white rounded-lg text-indigo-700 hover:text-indigo-900 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm truncate">Telegram</span>
                        </a>
                      )}
                      {author.linkedin && (
                        <a
                          href={`https://linkedin.com/in/${author.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-white rounded-lg text-indigo-700 hover:text-indigo-900 transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                          <span className="text-sm truncate">LinkedIn</span>
                        </a>
                      )}
                      {author.twitter && (
                        <a
                          href={`https://twitter.com/${author.twitter}`}
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
                      <span className="font-medium">ID:</span> {author.id}
                    </div>
                    {author.slug && (
                      <div>
                        <span className="font-medium">Slug:</span> /
                        {author.slug}
                      </div>
                    )}
                    {author.color && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Цвет:</span>
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: author.color }}
                        ></div>
                        <span className="font-mono text-xs">
                          {author.color}
                        </span>
                      </div>
                    )}
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
              onToggle={() => toggleCardExpansion(author.id)}
            />

            <EditButton
              item={author}
              handleClick={(author) => openModal("edit", author)}
            />
            <DeleteButton onClick={() => handleDelete(author.id.toString())} />
          </div>
        </div>
      </div>
    </div>
  );
};
