import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import type { ITender } from '../types';


const tenderSchema = z.object({
    title: z.string().min(3, { message: 'Назва повинная містити більше 3-х сиволів' }),
    budget: z.number({ message: "Введіть число" }).positive({ message: "Ціна має бути більше 0" }),
    description: z.string().min(10, { message: 'Опис тендера повинен мати більше 10-ти символів' }),
    deadline: z.string(),
})

type TenderFields = z.infer<typeof tenderSchema>;

interface TenderProps {
    onAddTender: (tender: ITender) => Promise<boolean>;
    currentUserId: string;
}



const CreateTender = ({ onAddTender, currentUserId }: TenderProps) => {
    const { register, handleSubmit, formState: { errors } } =
        useForm<TenderFields>({
            resolver: zodResolver(tenderSchema)
        });
    const navigate = useNavigate();


    const onSubmit = async (data: TenderFields) => {
        const newTender: ITender = {
            title: data.title,
            description: data.description,
            budget: data.budget,
            deadline: data.deadline,
            companyId: currentUserId,
            status: 'active',
        };

        const success = await onAddTender(newTender);

        if (success) {
            navigate('/');
        }
    }




    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">

                {/* Шапка формы */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Новий тендер</h1>
                    <p className="text-slate-500 font-medium text-sm">Заповніть деталі, щоб залучити найкращих виконавців</p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-8"
                >

                    {/* Блок: Назва */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Назва тендеру</label>
                        <input
                            type="text"
                            placeholder="Наприклад: Розробка дизайну мобільного додатку"
                            {...register('title')}
                            className={`w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 transition-all duration-200 text-slate-800 ${errors.title ? 'border-rose-200 focus:border-rose-400' : 'border-transparent focus:border-indigo-500 focus:bg-white'}`}
                        />
                        {errors.title?.message && <span className="text-rose-500 text-[11px] font-bold ml-4 italic">{errors.title.message}</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Блок: Бюджет */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Бюджет (₴)</label>
                            <input
                                type="number"
                                placeholder="0"
                                {...register('budget', { valueAsNumber: true })}
                                className={`w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 transition-all duration-200 font-bold text-indigo-600 ${errors.budget ? 'border-rose-200 focus:border-rose-400' : 'border-transparent focus:border-indigo-500 focus:bg-white'}`}
                            />
                            {errors.budget?.message && <span className="text-rose-500 text-[11px] font-bold ml-4 italic">{errors.budget.message}</span>}
                        </div>

                        {/* Блок: Дедлайн */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Кінцевий термін</label>
                            <input
                                type="datetime-local"
                                {...register('deadline')}
                                className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all duration-200 text-slate-600 font-medium"
                            />
                        </div>
                    </div>

                    {/* Блок: Опис */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Детальний опис проекту</label>
                        <textarea
                            placeholder="Опишіть вимоги, цілі та очікувані результати..."
                            {...register('description')}
                            className={`w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 transition-all duration-200 text-slate-700 min-h-[150px] resize-none ${errors.description ? 'border-rose-200 focus:border-rose-400' : 'border-transparent focus:border-indigo-500 focus:bg-white'}`}
                        ></textarea>
                        {errors.description?.message && <span className="text-rose-500 text-[11px] font-bold ml-4 italic">{errors.description.message}</span>}
                    </div>

                    {/* Кнопка отправки */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all duration-300 shadow-xl shadow-slate-200 active:scale-[0.98]"
                        >
                            Опублікувати тендер
                        </button>
                        <p className="text-center text-slate-400 text-[10px] mt-6 uppercase tracking-tighter">
                            Ваш тендер буде доступний для всіх верифікованих користувачів
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
}
export default CreateTender