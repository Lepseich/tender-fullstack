import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import type { IUser } from '../types';


const loginSchema = z.object({
    email: z.email({ message: "Це не схоже на пошту" }),
    password: z.string().min(6, { message: "Пароль має бути не менше 6 символів" }),
});


type LoginFields = z.infer<typeof loginSchema>;

interface LoginProps {
    onLogin: (email: string, pass: string) => Promise<boolean>;
}

const Login = ({ onLogin }: LoginProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFields>({
        resolver: zodResolver(loginSchema)
    });
    const navigate = useNavigate();
    const onSubmit = async (data: LoginFields) => {

        const success = await onLogin(data.email, data.password);


        if (success) {
            navigate('/');
        }

    };
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Заголовок вне карточки для чистоты */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Вхід у систему</h1>
                    <p className="text-slate-400 text-sm font-medium">Вітаємо знову! Будь ласка, введіть свої дані</p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-col gap-6"
                >
                    {/* Поле Email */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Електронна пошта</label>
                        <input
                            type="text"
                            placeholder="example@mail.com"
                            {...register('email')}
                            className={`px-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 transition-all duration-200 ${errors.email ? 'border-rose-100 focus:border-rose-400' : 'border-transparent focus:border-indigo-500 focus:bg-white'
                                }`}
                        />
                        {errors.email && <span className="text-rose-500 text-[10px] font-bold ml-5">{errors.email.message}</span>}
                    </div>

                    {/* Поле Пароль */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Пароль</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register('password')}
                            className={`px-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 transition-all duration-200 ${errors.password ? 'border-rose-100 focus:border-rose-400' : 'border-transparent focus:border-indigo-500 focus:bg-white'
                                }`}
                        />
                        {errors.password && <span className="text-rose-500 text-[10px] font-bold ml-5">{errors.password.message}</span>}
                    </div>

                    <button
                        type="submit"
                        className="mt-4 bg-slate-900 hover:bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 shadow-xl shadow-slate-200 active:scale-[0.98]"
                    >
                        Увійти
                    </button>

                    <p className="text-center text-slate-400 text-xs mt-2">
                        Немає акаунта? <Link to="/registration" className="text-indigo-600 font-bold hover:underline">Створити</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}


export default Login