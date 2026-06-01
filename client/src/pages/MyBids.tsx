import type { IBid, IUser, ITender } from '../types';


export interface MyBidsProps {
    currentUser: IUser;
    allBids: IBid[];
    tenders: ITender[];
}

const MyBids = ({ currentUser, allBids, tenders }: MyBidsProps) => {
    if (!currentUser) return null;
    const myBids = allBids.filter(m => m.userId === currentUser._id);


    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans antialiased">
            <div className="max-w-3xl mx-auto">

                {/* 1. ШАПКА СТРАНИЦЫ */}
                <div className="mb-10 flex justify-between items-end px-4">
                    <div>
                        <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Ваша активність</p>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Мої заявки</h1>
                    </div>
                    <span className="bg-white px-4 py-2 rounded-2xl shadow-sm text-sm font-bold text-slate-400 border border-slate-100">
                        Подано: {myBids.length}
                    </span>
                </div>

                {/* 2. СПИСОК КАРТОЧЕК */}
                <div className="flex flex-col gap-4">
                    {myBids.map(bid => {
                        const targetTender = tenders.find(t => t._id === bid.tenderId);

                        // Определяем цвета в зависимости от статуса
                        const statusStyles = {
                            accepted: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                            rejected: 'bg-rose-50 text-rose-600 border-rose-100',
                            pending: 'bg-blue-50 text-blue-600 border-blue-100'
                        };

                        return (
                            <div key={bid._id} className="bg-white p-6 rounded-[2.2rem] shadow-sm shadow-slate-200/50 border border-slate-100 hover:shadow-md transition-all duration-300">

                                {/* Название тендера как бейдж */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Проект:</span>
                                        <span className="text-sm font-bold text-slate-900">
                                            {targetTender?.title || 'Назва невідома'}
                                        </span>
                                    </div>

                                    {/* Статус заявки */}
                                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${statusStyles[bid.status as keyof typeof statusStyles]}`}>
                                        {bid.status}
                                    </div>
                                </div>

                                {/* Суть предложения */}
                                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                                    <div className="mb-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Ваш коментар:</span>
                                        <p className="text-sm text-slate-600 italic leading-relaxed mt-1">
                                            "{bid.message}"
                                        </p>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Ціна:</span>
                                        <span className="text-lg font-black text-indigo-600">
                                            {bid.price.toLocaleString()} ₴
                                        </span>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>

                {/* 3. ПУСТОЕ СОСТОЯНИЕ */}
                {myBids.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-slate-300">📋</div>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Ви ще не подали жодної заявки</p>
                    </div>
                )}

            </div>
        </div>
    );
}

export default MyBids