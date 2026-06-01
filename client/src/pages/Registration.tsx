import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';


const registerSchema = z.object({
    email: z.email({ message: "Це не схоже на пошту" }),
    username: z.string().min(3, { message: "Ім'я повинно містити більше 3-х символів" }),
    password: z.string().min(6, { message: "Пароль має бути не менше 6 символів" }),
    confirmPassword: z.string().min(6, { message: "Пароль має бути не менше 6 символів" }),
    role: z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Паролі не збігаються",
        path: ["confirmPassword"],
    });


type RegisterFields = z.infer<typeof registerSchema>;

interface RegisterProps {
    onReg: (user: any) => void;
}
const Registration = ({ onReg }: RegisterProps) => {
    const { register, handleSubmit, formState: { errors } } =
        useForm<RegisterFields>({
            resolver: zodResolver(registerSchema)
        });
    const navigate = useNavigate();
    const onSubmit = (data: RegisterFields) => {
        const newUser = {
            id: Date.now(),
            name: data.username,
            email: data.email,
            password: data.password,
            role: data.role,
            avatar: '#',
        }
        onReg(newUser);
        console.log('Новый пользователь создан');
        navigate('/');
    }
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-20">
            <div className="w-full max-w-lg">

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Реєстрація</h1>
                    <p className="text-slate-400 text-sm font-medium">Приєднуйтесь до платформи тендерів TenderPro</p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-col gap-6"
                >
                    {/* Username */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Ваше ім'я</label>
                        <input
                            type="text"
                            placeholder="Костянтин"
                            {...register('username')}
                            className="px-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all"
                        />
                        {errors.username && <span className="text-rose-500 text-[10px] font-bold ml-5">{errors.username.message}</span>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Електронна пошта</label>
                        <input
                            type="text"
                            placeholder="example@mail.com"
                            {...register('email')}
                            className="px-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all"
                        />
                        {errors.email && <span className="text-rose-500 text-[10px] font-bold ml-5">{errors.email.message}</span>}
                    </div>

                    {/* Роль */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Хто ви?</label>
                        <div className="relative">
                            <select
                                {...register('role')}
                                className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all cursor-pointer appearance-none text-slate-700 font-medium"
                            >
                                <option value="user">👤 Шукаю роботу (Користувач)</option>
                                <option value="company">🏢 Шукаю партнерів (Компанія)</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Пароли в ряд на десктопе */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Пароль</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                className="px-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Підтвердження</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                {...register('confirmPassword')}
                                className="px-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                    {(errors.password || errors.confirmPassword) && (
                        <span className="text-rose-500 text-[10px] font-bold ml-5">
                            {errors.password?.message || errors.confirmPassword?.message}
                        </span>
                    )}

                    <button
                        type="submit"
                        className="mt-4 bg-slate-900 hover:bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 shadow-xl shadow-slate-200 active:scale-[0.98]"
                    >
                        Створити акаунт
                    </button>

                    <p className="text-center text-slate-400 text-xs mt-2">
                        Вже є акаунт? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Увійти</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}



export default Registration;