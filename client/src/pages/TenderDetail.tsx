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
    onUpdateTender: (id: string, data: Partial<ITender>) => Promise<boolean>;
}



const TenderDetail = ({ tenders, currentUser, onAddBid, allBids, onChangeBidStatus, handleAcceptBid, onRejectBid, onUpdateTender }: TenderDetailProps) => {

    const [bidPrice, setBidPrice] = useState<number>(0);
    const [bidMessage, setBidMessage] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [bidFileUrl, setBidFileUrl] = useState('');
    const { tenderId } = useParams<{ tenderId: string }>();
    const tender = tenders.find(t => {
        return t._id === tenderId;
    })
    const navigate = useNavigate();
    const hasAlreadyApplied = allBids.some((e) => e.tenderId === tender!._id && e.userId === currentUser!._id);
    const myCurrentBid = allBids.find(b => b.tenderId === tender!._id && b.userId === currentUser!._id);
    const isOwner = currentUser && currentUser._id === tender?.companyId ? true : false;
    const tenderBids = allBids.filter(t => t.tenderId === tender!._id);

    const bidsForThisTender = allBids.filter(b => b.tenderId === tender?._id);
    const currentMinBid = bidsForThisTender.length > 0
        ? Math.min(...bidsForThisTender.map(b => b.price))
        : tender?.budget || 0;
    const winningBid = bidsForThisTender.find(b => b.status === 'accepted');
    const handleSubmitBid = async () => {
        if (bidPrice >= currentMinBid) {
            alert(`Ваша ставка повинна бути меншою за поточну (${currentMinBid} ₴)`);
            return;
        }

        const newBid: IBid = {
            tenderId: tender!._id!,
            userId: currentUser!._id!,
            userName: currentUser!.name,
            message: bidMessage,
            price: bidPrice,
            status: 'pending',
            fileUrl: bidFileUrl,
        };

        await onAddBid(newBid);
        setIsApplying(false);
        navigate('/my-bids');
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Кнопка НАЗАД */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-8 font-semibold text-sm group"
                >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                    Назад до списку
                </button>

                {tender ? (
                    <div className="space-y-8">


                        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">

                            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>


                            <div className={`mb-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${tender.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                }`}>
                                {tender.status}
                            </div>

                            <h1 className="text-3xl font-black text-slate-900 mb-4 leading-tight">{tender.title}</h1>
                            {isOwner && tender.status === 'active' && (
                                <button
                                    onClick={async () => {
                                        const newTitle = prompt("Нова назва тендеру:", tender.title);
                                        const newBudget = prompt("Новий бюджет:", tender.budget.toString());
                                        if (newTitle && newBudget) {
                                            // Вызываем функцию из пропсов!
                                            await onUpdateTender(tender._id!, {
                                                title: newTitle,
                                                budget: Number(newBudget)
                                            });
                                        }
                                    }}
                                    className="text-xs text-indigo-500 underline"
                                >
                                    Редагувати умови
                                </button>
                            )}

                            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Бюджет замовника</p>
                                    <p className="text-xl font-black text-slate-900">{tender.budget.toLocaleString()} ₴</p>
                                </div>
                                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 text-indigo-600">
                                    <p className="text-[10px] font-bold uppercase mb-1 opacity-70">Найменша ставка</p>
                                    <p className="text-xl font-black">{currentMinBid.toLocaleString()} ₴</p>
                                </div>
                            </div>

                            <p className="text-slate-500 leading-relaxed max-w-xl mb-8">
                                {tender.description || "Опис тендеру відсутній..."}
                            </p>
                            {tender.fileUrl && (
                                <div className="mb-8 w-full flex justify-center">
                                    <a
                                        href={tender.fileUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all duration-300 group"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                        <span className="text-sm font-black uppercase tracking-widest">Переглянути технічне завдання</span>
                                    </a>
                                </div>
                            )}
                            <div className="flex flex-col items-center gap-4 w-full">

                                <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m9-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <Timer deadline={tender.deadline} status={tender.status} />
                                </div>


                                {tender.status === 'closed' && winningBid && isOwner && (
                                    <div className="w-full p-6 bg-indigo-600 rounded-[2rem] text-white text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-2">Переможець обраний</p>
                                        <h3 className="text-xl font-bold mb-1">{winningBid.userName}</h3>
                                        <p className="text-sm opacity-90 font-medium">Контакт: <span className="underline italic">user_email@test.com</span></p>
                                        <div className="mt-4 text-2xl font-black">{winningBid.price.toLocaleString()} ₴</div>
                                    </div>
                                )}


                                {!isApplying && currentUser?.role === 'user' && !hasAlreadyApplied && tender.status === 'active' && (
                                    <button
                                        onClick={() => setIsApplying(true)}
                                        className="bg-slate-900 hover:bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-slate-200"
                                    >
                                        Запропонувати кращу ціну
                                    </button>
                                )}


                                {tender.status === 'closed' && !winningBid && (
                                    <div className="mt-4 p-4 bg-rose-50 rounded-2xl border border-rose-100 text-rose-600 font-bold text-sm uppercase tracking-wide">
                                        Прийом заявок завершено
                                    </div>
                                )}


                                {hasAlreadyApplied && !isApplying && (
                                    <div className="mt-6 p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 w-full text-left">
                                        <p className="text-emerald-700 font-black text-xs uppercase mb-3 flex items-center gap-2">
                                            <span className="bg-emerald-500 text-white rounded-full p-0.5 text-[8px]">✓</span>
                                            Ваша пропозиція зафіксована
                                        </p>
                                        <div className="space-y-1">
                                            <p className="text-slate-900 font-bold text-lg">{myCurrentBid?.price.toLocaleString()} ₴</p>
                                            <p className="text-slate-500 text-sm italic">"{myCurrentBid?.message}"</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isApplying && (
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-2 border-indigo-500/20 flex flex-col gap-6 animate-in fade-in zoom-in duration-300">
                                <h2 className="text-xl font-bold text-slate-900">Нова пропозиція</h2>
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-4">Ваша ціна (менше {currentMinBid} ₴)</label>
                                        <input
                                            type="number"
                                            value={bidPrice}
                                            onChange={(e) => setBidPrice(Number(e.target.value))}
                                            className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-800"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-4">Посилання на документи (PDF/Портфоліо)</label>
                                        <input
                                            type="url"
                                            value={bidFileUrl}
                                            onChange={(e) => setBidFileUrl(e.target.value)}
                                            placeholder="https://google.drive/..."
                                            className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-4">Коментар</label>
                                        <textarea
                                            value={bidMessage}
                                            onChange={(e) => setBidMessage(e.target.value)}
                                            className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700 min-h-[120px] resize-none"
                                            placeholder="Чому обрати вас?"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={handleSubmitBid} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all active:scale-95">
                                        Надіслати пропозицію
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
                                    <div className="w-1 h-4 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]"></div>
                                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Пропозиції виконавців</h2>
                                </div>

                                <div className="space-y-4">
                                    {tenderBids.map(bid => (
                                        <div key={bid._id} className="bg-white p-6 rounded-[2.2rem] shadow-sm border border-slate-100 flex justify-between items-center group hover:shadow-md transition-all">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">{bid.userName}</span>
                                                <p className="text-slate-800 font-medium italic">"{bid.message}"</p>
                                                {bid.fileUrl && (
                                                    <a
                                                        href={bid.fileUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[10px] font-bold text-indigo-600 hover:underline"
                                                    >
                                                        📎 ПЕРЕГЛЯНУТИ ДОКУМЕНТИ
                                                    </a>
                                                )}
                                                <span className="text-lg font-black text-slate-900 mt-2">{bid.price.toLocaleString()} ₴</span>

                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAcceptBid(bid._id!, tender._id!)}
                                                    className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100"
                                                >
                                                    Прийняти
                                                </button>
                                                <button
                                                    onClick={() => onRejectBid(bid._id!)}
                                                    className="px-5 py-2.5 bg-white text-rose-500 border border-rose-100 rounded-xl text-xs font-bold hover:bg-rose-50 transition-all"
                                                >
                                                    Відхилити
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {tenderBids.length === 0 && (
                                        <div className="text-center py-12 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-400 text-sm font-medium">
                                            Наразі жодної пропозиції не надходило
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-slate-100">
                        <h1 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Тендер не знайдено</h1>
                    </div>
                )}
            </div>
        </div>
    );
}
export default TenderDetail