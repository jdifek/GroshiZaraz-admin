'use client';
import { useContext } from 'react';
import { Trash2 } from 'lucide-react';
import { DataContext } from '../context/DataContext';

export default function NewsLikesPage() {
  const { newsLikes, handleDelete } = useContext(DataContext);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Управление лайками новостей</h1>
          <p className="text-gray-600">Просмотр и управление лайками</p>
        </div>
      </div>

      <div className="grid gap-6">
        {newsLikes.map(like => (
          <div key={like.id} className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Лайк #{like.id}</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Новость ID</p>
                    <p className="font-medium">{like.newsId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Дата</p>
                    <p className="font-medium">{new Date(like.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">IP Hash</p>
                    <p className="font-medium">{like.ipHash}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete('newsLike', like.id)}
                  className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}