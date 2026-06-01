import { useState } from 'react';
import type { ITender } from '../types';
import { Link } from 'react-router-dom';
import Timer from '../components/Timer'


export interface TenderListProps {
    tenders: ITender[]; // 
}

const TenderList = ({ tenders }: TenderListProps) => {

    const [searchQuery, setSearchQuery] = useState('');

    const filteredTenders = tenders.filter(t => {
        const tlc = t.title.toLowerCase();
        return tlc.includes(searchQuery.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Заголовок и описание */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
                        Доступні тендери
                    </h1>
                    <p className="text-slate-500 font-medium">Знайдіть ідеальний проект для вашого бізнесу</p>
                </div>

                {/* Поиск с иконкой */}
                <div className="relative max-w-md mx-auto mb-16">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Пошук за назвою тендеру..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg transition-all text-slate-700 placeholder:text-slate-400"
                    />
                </div>

                {/* Список тендеров */}
                <div className="grid gap-4">
                    {filteredTenders.map(t => (
                        <Link key={t._id} to={`/tender/${t._id}`} className="block transition-transform duration-300 hover:-translate-y-1">
                            <div className="bg-white p-6 rounded-[1.8rem] shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all flex justify-between items-center group">

                                <div className="flex flex-col gap-1">
                                    <span className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                        {t.title}
                                    </span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-blue-600 font-black text-sm">
                                            {t.budget.toLocaleString()} ₴
                                        </span>
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 2m9-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <Timer deadline={t.deadline} status={t.status} />
                                        </div>
                                    </div>
                                </div>

                                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${t.status === 'active'
                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                                    }`}>
                                    {t.status}
                                </div>
                            </div>
                        </Link>
                    ))}

                    {filteredTenders.length === 0 && (
                        <div className="text-center py-20 bg-slate-100/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Нічого не знайдено</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default TenderList; 