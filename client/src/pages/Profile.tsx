import type { ITender, IUser, IBid } from '../types';

export interface ProfileProps {
    currentUser: IUser;
    tenders: ITender[];
    allBids: IBid[];
}



const Profile = ({ currentUser, tenders, allBids }: ProfileProps) => {
    const userTenders = tenders.filter(t => t.companyId === currentUser._id);
    const userBids = allBids.filter(b => b.userId === currentUser._id);



    const closedTendersCount = userTenders.filter(t => t.status === 'closed').length;
    const companyRating = userTenders.length > 0 ? Math.round((closedTendersCount / userTenders.length) * 100) : 0;
    const myWins = allBids.filter(b => b.userId === currentUser._id && b.status === 'accepted');
    const winNotifications = allBids.filter(b => b.userId === currentUser?._id && b.status === 'accepted');
    const myTenderIds = tenders.filter(t => t.companyId === currentUser?._id).map(t => t._id);
    const newBidsNotifications = allBids.filter(b => myTenderIds.includes(b.tenderId) && b.status === 'pending');

    // 1. Статистика для Компанії (Замовника)
    const totalCreated = userTenders.length;
    const totalClosed = userTenders.filter(t => t.status === 'closed').length;
    // Формула: (Завершені / Всього) * 100
    const companyEfficiency = totalCreated > 0
        ? Math.round((totalClosed / totalCreated) * 100)
        : 0;

    // 2. Статистика для Юзера (Виконавця)
    const totalApplied = userBids.length;
    const totalWon = userBids.filter(b => b.status === 'accepted').length;
    // Формула: (Перемоги / Всього заявок) * 100
    const userSuccessRate = totalApplied > 0
        ? Math.round((totalWon / totalApplied) * 100)
        : 0;



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


                                {/* СЕКЦІЯ СТАТИСТИКИ */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                                    {/* Карточка 1: Количественные показатели */}
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Активність</span>
                                        <span className="text-4xl font-black text-slate-900">
                                            {currentUser.role === 'company' ? totalCreated : totalApplied}
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-500 mt-1">
                                            {currentUser.role === 'company' ? 'Створених тендерів' : 'Поданих заявок'}
                                        </span>
                                    </div>

                                    {/* Карточка 2: Рейтинг эффективности */}
                                    <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl shadow-indigo-100 flex flex-col items-center justify-center text-center text-white">
                                        <span className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-2">Рейтинг успіху</span>
                                        <span className="text-4xl font-black">
                                            {currentUser.role === 'company' ? companyEfficiency : userSuccessRate}%
                                        </span>
                                        <div className="w-full bg-white/20 h-1 rounded-full mt-4 overflow-hidden">
                                            <div
                                                className="bg-white h-full transition-all duration-1000"
                                                style={{ width: `${currentUser.role === 'company' ? companyEfficiency : userSuccessRate}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

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

                <div className="mb-10">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-6">Сповіщення</h3>

                    <div className="space-y-3">
                        {/* Уведомления для юзера о победе */}
                        {currentUser?.role === 'user' && winNotifications.map(note => {
                            // Ищем тендер, к которому относится эта победная заявка
                            const targetTender = tenders.find(t => t._id === note.tenderId);

                            return (
                                <div key={note._id} className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3">
                                    <span className="text-xl">🎉</span>
                                    <div>
                                        <p className="text-sm font-bold text-emerald-900">
                                            Перемога у тендері: {targetTender?.title || 'Назва завантажується...'}
                                        </p>
                                        <p className="text-xs text-emerald-700 opacity-80">
                                            Ваша пропозиція {note.price.toLocaleString()} ₴ була офіційно прийнята. Вам прийде запрошення на пошту.
                                        </p>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Уведомления для компании о новых заявках */}
                        {currentUser?.role === 'company' && newBidsNotifications.map(note => (
                            <div key={note._id} className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
                                <span className="text-xl">📩</span>
                                <div>
                                    <p className="text-sm font-bold text-indigo-900">Нова пропозиція</p>
                                    <p className="text-xs text-indigo-700 opacity-80">Користувач {note.userName} подав заявку на суму {note.price.toLocaleString()} ₴</p>
                                </div>
                            </div>
                        ))}

                        {/* Если уведомлений нет */}
                        {((currentUser?.role === 'user' && winNotifications.length === 0) ||
                            (currentUser?.role === 'company' && newBidsNotifications.length === 0)) && (
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center">
                                    <p className="text-slate-400 text-xs font-medium uppercase tracking-tighter">Нових сповіщень немає</p>
                                </div>
                            )}
                    </div>
                </div>
                <p className="text-center mt-8 text-slate-400 text-xs">
                    tender-react platform v1.0
                </p>
            </div>
        </div>
    );
}
export default Profile