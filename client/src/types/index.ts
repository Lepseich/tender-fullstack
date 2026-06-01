export interface IUser {
    _id: string,
    name: string,
    email: string,
    role: 'user' | 'company' | 'admin',
    avatar: string,
}
export interface ITender {
    _id?: string,
    title: string,
    description: string, 
    budget: number,
    deadline: string,
    companyId: string,
    status: 'active' | 'closed' | 'pending',
}
export interface IBid {
    _id?: string,
    tenderId: string,
    userId: string,
    userName: string,
    message: string,
    price: number,
    status: 'pending' | 'accepted' | 'rejected', 
}
