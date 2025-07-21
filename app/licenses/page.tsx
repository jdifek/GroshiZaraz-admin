/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useContext } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { DataContext } from '../context/DataContext';

export default function LicensesPage() {
  const { licenses, searchTerm, setSearchTerm, setIsModalOpen, setModalMode, setSelectedItem, handleDelete } = useContext(DataContext);

  const openModal = (mode: 'create' | 'edit', item: any = null) => {
    setModalMode(mode);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Управление лицензиями</h1>
          <p className="text-gray-600">Управление лицензиями МФО</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Добавить лицензию
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск лицензий..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {licenses
          .filter(license => license.number.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(license => (
            <div key={license.id} className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{license.number}</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Дата выдачи</p>
                      <p className="font-medium">{new Date(license.issuedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Действует до</p>
                      <p className="font-medium">{new Date(license.validTill).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">МФО ID</p>
                      <p className="font-medium">{license.mfoId}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal('edit', license)}
                    className="w-10 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('license', license.id)}
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