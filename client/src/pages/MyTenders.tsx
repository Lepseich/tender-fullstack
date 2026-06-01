import type { ITender, IUser } from '../types';
import { Link } from 'react-router-dom';

export interface MyTendersProps {
    tenders: ITender[];
    currentUser: IUser | null;
}


const MyTenders = ({ tenders, currentUser }: MyTendersProps) => {
    const currentUserTenders = tenders.filter(t => t.companyId === currentUser!._id);


    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-3xl mx-auto"> {/* Контейнер СНАРУЖИ мапа */}

                {/* Заголовок в стиле Apple */}
                <div className="mb-10 flex justify-between items-end px-4">
                    <div>
                        <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Огляд діяльності</p>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ваші тендери</h1>
                    </div>
                    <span className="bg-white px-4 py-2 rounded-2xl shadow-sm text-sm font-bold text-slate-400 border border-slate-100">
                        Всього: {currentUserTenders.length}
                    </span>
                </div>

                <div className="flex flex-col gap-4">
                    {currentUserTenders.map(t => {
                        const isClosed = t.status === 'closed';

                        return (
                            <Link key={t._id} to={`/tender/${t._id}`} className="block group">
                                <div className={`p-6 rounded-[2.2rem] transition-all duration-300 border flex justify-between items-center ${isClosed
                                        ? 'bg-slate-100/50 border-transparent opacity-60'
                                        : 'bg-white border-slate-100 shadow-sm shadow-slate-200/50 group-hover:shadow-md group-hover:border-indigo-100 group-hover:-translate-y-0.5'
                                    }`}>

                                    <div className="flex flex-col gap-1">
                                        <span className={`text-lg font-bold transition-colors ${isClosed ? 'text-slate-500' : 'text-slate-800 group-hover:text-indigo-600'
                                            }`}>
                                            {t.title}
                                        </span>
                                        <span className={`font-black text-sm ${isClosed ? 'text-slate-400' : 'text-indigo-600'}`}>
                                            {t.budget.toLocaleString()} ₴
                                        </span>
                                    </div>

                                    <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${t.status === 'active'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            : 'bg-white text-slate-400 border-slate-200'
                                        }`}>
                                        {t.status}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Красивое пустое состояние */}
                {currentUserTenders.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📦</div>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Ви ще не створили жодного тендера</p>
                    </div>
                )}

            </div>
        </div>
    );
}




export default MyTenders