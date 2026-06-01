import { useState } from 'react';
import type { ITender, IUser, IBid } from '../types';
import { useParams, useNavigate } from 'react-router-dom';
import Timer from '../components/Timer'




export interface TenderDetailProps {
    tenders: ITender[];
    currentUser: IUser | null;
    onAddBid: (bids: IBid) => void;
    allBids: IBid[];
    onChangeBidStatus: (bidId: string, newStatus: 'accepted' | 'rejected') => void;
    handleAcceptBid: (bidId: string, tenderId: string) => void;
    onRejectBid: (bidId: string) => void;
}



const TenderDetail = ({ tenders, currentUser, onAddBid, allBids, onChangeBidStatus, handleAcceptBid, onRejectBid }: TenderDetailProps) => {

    const [bidPrice, setBidPrice] = useState<number>(0);
    const [bidMessage, setBidMessage] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const { tenderId } = useParams<{ tenderId: string }>();
    const tender = tenders.find(t => {
        return t._id === tenderId;
    })
    const navigate = useNavigate();

    const handleSubmitBid = () => {
        const newBid: IBid = {
            tenderId: tender!._id!,
            userId: currentUser!._id!,
            userName: currentUser!.name,
            message: bidMessage,
            price: bidPrice,
            status: 'pending',
        }
        onAddBid(newBid);
        setIsApplying(false);
        navigate('/');
    }
    const hasAlreadyApplied = allBids.some((e) => e.tenderId === tender!._id && e.userId === currentUser!._id);
    const myCurrentBid = allBids.find(b => b.tenderId === tender!._id && b.userId === currentUser!._id);
    const isOwner = currentUser && currentUser._id === tender?.companyId ? true : false;
    const tenderBids = allBids.filter(t => t.tenderId === tender!._id);


    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Кнопка НАЗАД */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-8 font-semibold text-sm group"
                >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    Назад до списку
                </button>

                {tender ? (
                    <div className="space-y-8">

                        {/* ГЛАВНАЯ КАРТОЧКА ТЕНДЕРА */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
                            {/* Декоративный элемент сверху */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>

                            <div className={`mb-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${tender.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                }`}>
                                {tender.status}
                            </div>

                            <h1 className="text-3xl font-black text-slate-900 mb-4 leading-tight">{tender.title}</h1>

                            <div className="text-4xl font-black text-indigo-600 mb-6">
                                {tender.budget.toLocaleString()} <span className="text-lg font-bold">₴</span>
                            </div>

                            <p className="text-slate-500 leading-relaxed max-w-xl mb-8">
                                {tender.description || "Опис тендеру відсутній..."}
                            </p>

                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m9-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <Timer deadline={tender.deadline} status={tender.status} />
                                </div>

                                {/* Кнопка подачи для юзера */}
                                {!isApplying && currentUser?.role === 'user' && !hasAlreadyApplied && tender.status === 'active' && (
                                    <button
                                        onClick={() => setIsApplying(true)}
                                        className="bg-slate-900 hover:bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-slate-200"
                                    >
                                        Подати свою пропозицію
                                    </button>
                                )}

                                {/* Если тендер закрыт */}
                                {tender.status === 'closed' && (
                                    <div className="mt-4 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                                        <p className="text-rose-600 font-bold text-sm uppercase tracking-wide">Прийом заявок завершено</p>
                                    </div>
                                )}

                                {/* Если юзер уже подал заявку */}
                                {hasAlreadyApplied && !isApplying && (
                                    <div className="mt-6 p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 w-full text-left">
                                        <p className="text-emerald-700 font-black text-xs uppercase mb-3 flex items-center gap-2">
                                            <span className="bg-emerald-500 text-white rounded-full p-0.5 text-[8px]">✓</span>
                                            Ви вже подали заявку
                                        </p>
                                        <div className="space-y-1">
                                            <p className="text-slate-900 font-bold text-lg">{myCurrentBid?.price.toLocaleString()} ₴</p>
                                            <p className="text-slate-500 text-sm italic">"{myCurrentBid?.message}"</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ФОРМА ПОДАЧИ (появляется вместо или под карточкой) */}
                        {isApplying && (
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-2 border-indigo-500/20 flex flex-col gap-6 animate-in fade-in zoom-in duration-300">
                                <h2 className="text-xl font-bold text-slate-900">Ваша пропозиція</h2>
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-4">Бажаний бюджет</label>
                                        <input
                                            type="number"
                                            value={bidPrice}
                                            onChange={(e) => setBidPrice(Number(e.target.value))}
                                            className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-800"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-4">Коментар до заявки</label>
                                        <textarea
                                            value={bidMessage}
                                            onChange={(e) => setBidMessage(e.target.value)}
                                            className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700 min-h-[120px] resize-none"
                                            placeholder="Опишіть ваші переваги..."
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={handleSubmitBid} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all active:scale-95">
                                        Надіслати заявку
                                    </button>
                                    <button onClick={() => setIsApplying(false)} className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                                        Скасувати
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* СПИСОК ЗАЯВОК ДЛЯ ВЛАДЕЛЬЦА */}
                        {isOwner && (
                            <div className="mt-12">
                                <div className="flex items-center gap-2 mb-6 px-2">
                                    <div className="w-1 h-4 bg-indigo-600 rounded-full"></div>
                                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Пропозиції від виконавців</h2>
                                </div>

                                <div className="space-y-4">
                                    {tenderBids.map(bid => (
                                        <div key={bid._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center group hover:shadow-md transition-all">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-black text-indigo-600 uppercase">{bid.userName}</span>
                                                <p className="text-slate-800 font-medium italic">"{bid.message}"</p>
                                                <span className="text-lg font-bold text-slate-900 mt-2">{bid.price.toLocaleString()} ₴</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAcceptBid(bid._id!, tender._id!)}
                                                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100"
                                                >
                                                    Прийняти
                                                </button>
                                                <button
                                                    onClick={() => onRejectBid(bid._id!)}
                                                    className="px-4 py-2 bg-white text-rose-500 border border-rose-100 rounded-xl text-xs font-bold hover:bg-rose-50 transition-all"
                                                >
                                                    Відхилити
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {tenderBids.length === 0 && (
                                        <div className="text-center py-12 bg-slate-100/50 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 text-sm">
                                            Наразі жодної пропозиції немає
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h1 className="text-2xl font-bold text-slate-400">Тендер не знайдено</h1>
                    </div>
                )}
            </div>
        </div>
    );
}
export default TenderDetail