import { useState } from 'react';
import type { ITender, IUser, IBid } from '../types';


interface AdminProps {
    tenders: ITender[];
    users: IUser[];
    onDeleteUser: (id: string) => void;
    onDeleteTender: (id: string) => void;
    currentUser: IUser;
}


const Admin = ({ tenders, users, onDeleteTender, onDeleteUser, currentUser }: AdminProps) => {






    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Главный заголовок страницы */}
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Панель керування</h1>
                <p className="text-slate-500 text-sm">Керуйте користувачами та активними тендерами системи</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                {/* КОЛОНКА КОРИСТУВАЧІВ */}
                <section>
                    <div className="flex items-center gap-2 mb-6 px-2">
                        <div className="w-1.5 h-5 bg-indigo-600 rounded-full"></div>
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Користувачі</h2>
                    </div>

                    <div className="space-y-3">
                        {users.map((u: IUser) => (
                            <div key={u._id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all duration-200">
                                <div className="flex items-center gap-4">
                                    {/* Имитация аватарки */}
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 text-xs uppercase">
                                        {u.name[0]}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900 leading-none mb-1">{u.name}</span>
                                        <span className="text-[11px] text-slate-500 font-medium">{u.email}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Цветные бейджи ролей */}
                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${u.role === 'admin' ? 'bg-rose-100 text-rose-600' :
                                            u.role === 'company' ? 'bg-blue-100 text-blue-600' :
                                                'bg-emerald-100 text-emerald-600'
                                        }`}>
                                        {u.role}
                                    </span>

                                    {u._id !== currentUser._id ? (
                                        <button
                                            onClick={() => onDeleteUser(u._id)}
                                            className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                            title="Видалити користувача"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    ) : (
                                        <div className="w-8"></div> /* Пустое место для самого себя */
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* КОЛОНКА ТЕНДЕРІВ */}
                <section>
                    <div className="flex items-center gap-2 mb-6 px-2">
                        <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Активні тендери</h2>
                    </div>

                    <div className="space-y-3">
                        {tenders.map((t: ITender) => (
                            <div key={t._id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all duration-200 group">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                                        {t.title}
                                    </span>
                                    <span className="text-[10px] text-blue-500 font-bold mt-1">
                                        {t.budget.toLocaleString()} ₴
                                    </span>
                                </div>

                                <button
                                    onClick={() => onDeleteTender(t._id!)}
                                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        ))}
                        {tenders.length === 0 && (
                            <div className="text-center py-10 bg-slate-100/50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs font-bold uppercase">
                                Тендерів не знайдено
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
export default Admin