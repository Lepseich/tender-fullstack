import type { ITender, IUser, IBid } from '../types';

export interface ProfileProps {
    currentUser: IUser;
    tenders: ITender[];
    allBids: IBid[];
}



const Profile = ({ currentUser, tenders, allBids }: ProfileProps) => {
    const userTenders = tenders.filter(t => t.companyId === currentUser._id);
    const userBids = allBids.filter(b => b.userId === currentUser._id);








    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">

                {/* 1. ВЕРХНЯЯ ЧАСТЬ - АВАТАР И ИМЯ */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-28 h-24 bg-indigo-600 rounded-full flex items-center justify-center shadow-xl shadow-indigo-200 mb-4 border-4 border-white">
                        <span className="text-4xl font-black text-white uppercase">
                            {currentUser.name[0]}
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{currentUser.name}</h1>
                    <p className="text-slate-500 font-medium">{currentUser.email}</p>
                </div>

                {/* 2. ОСНОВНАЯ КАРТОЧКА ИНФОРМАЦИИ */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 space-y-8">

                        {/* Строка: Роль */}
                        <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Тип аккаунта</span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${currentUser.role === 'admin' ? 'bg-rose-100 text-rose-600' :
                                    currentUser.role === 'company' ? 'bg-blue-100 text-blue-600' :
                                        'bg-emerald-100 text-emerald-600'
                                }`}>
                                {currentUser.role}
                            </span>
                        </div>

                        {/* 3. СЕКЦИЯ СТАТИСТИКИ - ПЛИТКИ */}
                        <div className="pt-2">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ваша активність</h3>

                            <div className="grid grid-cols-1 gap-4">
                                {currentUser.role === 'company' && (
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center transition-transform hover:scale-[1.02]">
                                        <span className="text-5xl font-black text-indigo-600 mb-2">{userTenders.length}</span>
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Створених тендерів</span>
                                    </div>
                                )}

                                {currentUser.role === 'user' && (
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center transition-transform hover:scale-[1.02]">
                                        <span className="text-5xl font-black text-emerald-500 mb-2">{userBids.length}</span>
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Поданих заявок</span>
                                    </div>
                                )}

                                {/* Для админа можно добавить общую инфу */}
                                {currentUser.role === 'admin' && (
                                    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col items-center shadow-lg shadow-slate-200">
                                        <span className="text-white font-bold text-center">Ви маєте повний доступ до керування системою</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Кнопка логаута под карточкой для чистоты */}
                <p className="text-center mt-8 text-slate-400 text-xs">
                    tender-react platform v1.0
                </p>
            </div>
        </div>
    );
}
export default Profile